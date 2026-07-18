import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";

import {
  readJsonFile,
  writeJsonFile,
} from "@/lib/file-store";

import { GalleryImage } from "@/lib/types";


const FILE = "gallery.json";


interface GalleryCreateInput {
  imageUrl: string;
  publicId: string;
  category: string;
  title: string;
}


interface UploadMeta {
  title?: string;
  alt?: string;
  category?: string;
}


function normalizeCategory(value?: string) {
  return value?.trim() || "Campus";
}


function normalizeTitle(
  value?: string,
  fallback = "Institute Image"
) {
  return value?.trim() || fallback;
}



async function getImages(){

  return await readJsonFile<GalleryImage[]>(
    FILE,
    []
  );

}



async function saveImages(
  images:GalleryImage[]
){

  await writeJsonFile(
    FILE,
    images
  );

}



export async function listGalleryImages(
  category?:string
){

  const images =
    await getImages();


  if(category){

    return images.filter(
      img =>
      img.category.toLowerCase()
      ===
      category.toLowerCase()
    );

  }


  return images;

}





export async function createGalleryImages(
  entries:GalleryCreateInput[]
){

  const images =
    await getImages();


  const created:GalleryImage[] =
    entries.map((entry,index)=>({

      id:crypto.randomUUID(),

      url:entry.imageUrl,

      alt:entry.title,

      title:entry.title,

      category:entry.category,

      publicId:entry.publicId,

      sortOrder:
      images.length + index

    }));


  const updated =
    [
      ...created,
      ...images
    ];


  await saveImages(updated);


  return created;

}




function parseMeta(
 metaRaw:FormDataEntryValue | null
){

 if(typeof metaRaw !== "string")
    return [] as UploadMeta[];


 try{

  const parsed =
    JSON.parse(metaRaw);


  return Array.isArray(parsed)
    ? parsed
    : [];


 }catch{

  return [];

 }

}




export async function uploadGalleryImagesFromFormData(
 formData:FormData
){

 const files =
 formData
 .getAll("files")
 .filter(
  (entry):entry is File =>
  entry instanceof File
 );


 if(files.length===0){
  throw new Error(
    "No image files provided"
  );
 }


 const meta =
 parseMeta(
  formData.get("meta")
 );


 const entries:GalleryCreateInput[]=[];


 for(const [index,file] of files.entries()){


  const fileMeta =
  meta[index] ?? {};


  const category =
  normalizeCategory(
    fileMeta.category
  );


  const title =
  normalizeTitle(
    fileMeta.title,
    file.name
  );



  const upload =
  await uploadImageToCloudinary(
    file,
    {
      category,
      title
    }
  );



  entries.push({

    imageUrl:
    upload.secureUrl,

    publicId:
    upload.publicId,

    category,

    title

  });


 }


 return createGalleryImages(entries);

}





export async function updateGalleryImageMetadata(
 id:string,
 data:{
  title:string;
  category:string
 }
){

 const images =
 await getImages();


 const updated =
 images.map(img=>

 img.id===id
 ?
 {
  ...img,

  title:
  normalizeTitle(data.title),

  category:
  normalizeCategory(data.category)
 }
 :
 img

 );


 await saveImages(updated);


 return updated.find(
  img=>img.id===id
 );

}




export async function reorderGalleryImages(
  ids: string[]
) {

  const images =
    await getImages();


  const reordered = ids
    .map((id) =>
      images.find(
        (img) => img.id === id
      )
    )
    .filter(
      (img): img is GalleryImage =>
        Boolean(img)
    );


  await saveImages(
    reordered
  );


  return reordered;
}