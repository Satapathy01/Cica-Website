import { readJsonFile, writeJsonFile } from "@/lib/file-store";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { GalleryDisplayConfig } from "@/lib/types";

const DEFAULT_CONFIG: GalleryDisplayConfig = {
  mode: "grid",
};

const LOCAL_FILE = "gallery-display.json";
const STORAGE_PATH = "configs/gallery-display.json";

const STORAGE_CONTENT_TYPES = [
  "application/json",
  "text/plain",
  "application/octet-stream",
];

function normalizeConfig(
  input: Partial<GalleryDisplayConfig> | null | undefined
): GalleryDisplayConfig {
  return {
    mode: input?.mode === "slideshow" ? "slideshow" : "grid",
  };
}

function getDocumentsBucket() {
  return process.env.SUPABASE_DOCUMENTS_BUCKET ?? "documents";
}

function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

function isNotFoundError(message: string) {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("not found") ||
    normalized.includes("404") ||
    normalized.includes("does not exist")
  );
}


// GET CONFIG

export async function getGalleryDisplayConfig() {

  // Development → JSON file
  if (!isProductionRuntime()) {
    const local =
      await readJsonFile<GalleryDisplayConfig>(
        LOCAL_FILE,
        DEFAULT_CONFIG
      );

    return normalizeConfig(local);
  }


  // Production → Supabase Storage

  const supabase = getSupabaseAdminClient();

  const { data, error } =
    await supabase.storage
      .from(getDocumentsBucket())
      .download(STORAGE_PATH);


  if(error){

    if(isNotFoundError(error.message)){
      return DEFAULT_CONFIG;
    }


    throw new Error(
      `Failed loading gallery config: ${error.message}`
    );
  }


  try {

    const parsed =
      JSON.parse(await data.text());

    return normalizeConfig(parsed);

  } catch {

    return DEFAULT_CONFIG;
  }
}



// SAVE CONFIG


export async function saveGalleryDisplayConfig(
  config: GalleryDisplayConfig
){

  const normalized =
    normalizeConfig(config);



  // Development save

  if(!isProductionRuntime()){

    await writeJsonFile(
      LOCAL_FILE,
      normalized
    );


    return normalized;
  }



  // Production save

  const supabase =
    getSupabaseAdminClient();


  const body =
    Buffer.from(
      JSON.stringify(
        normalized,
        null,
        2
      )
    );


  for(const contentType of STORAGE_CONTENT_TYPES){


    const {error} =
      await supabase.storage
      .from(getDocumentsBucket())
      .upload(
        STORAGE_PATH,
        body,
        {
          contentType,
          upsert:true
        }
      );


    if(!error){
      return normalized;
    }

  }


  throw new Error(
    "Failed saving gallery configuration"
  );
}