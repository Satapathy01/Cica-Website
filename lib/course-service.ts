import {
  saveFileLocally,
  deleteLocalFile,
} from "@/lib/local-storage";

import {
  readJsonFile,
  writeJsonFile,
} from "@/lib/file-store";

import { StaffMember, Teacher } from "@/lib/types";


const FILE = "teachers.json";


interface TeacherInput {
  name: string;
  subject: string;
  description: string;
}


interface TeacherUpdateInput extends TeacherInput {
  imageFile?: File | null;
}



function normalizeText(value:string){
  return value.trim();
}


async function getTeachers(){

 return await readJsonFile<Teacher[]>(
  FILE,
  []
 );

}



async function saveTeachers(
 teachers:Teacher[]
){

 await writeJsonFile(
  FILE,
  teachers
 );

}



export function parseTeacherFormData(
 formData:FormData,
 options?:{
  requireImage?:boolean
 }
){

 const name =
 normalizeText(
  String(formData.get("name") ?? "")
 );


 const subject =
 normalizeText(
  String(formData.get("subject") ?? "")
 );


 const description =
 normalizeText(
  String(
   formData.get("description")
   ??
   formData.get("bio")
   ??
   ""
  )
 );


 const file =
 formData.get("image")
 ??
 formData.get("file");


 const imageFile =
 file instanceof File
 ? file
 : null;


 if(
  options?.requireImage
  &&
  !imageFile
 ){
  throw new Error(
   "Teacher image required"
  );
 }


 return {
  name,
  subject,
  description,
  imageFile
 };

}




export async function listTeachers()
:Promise<Teacher[]>{

 return await getTeachers();

}





export async function listTeacherStaffMembers(): Promise<StaffMember[]> {
  const teachers = await getTeachers();

  return teachers.map((teacher) => ({
    id: teacher.id,

    name: teacher.name,

    subject: teacher.subject,

    bio: teacher.description,

    photo: teacher.imageUrl,

    pdfUrl: teacher.pdfUrl,

    pdfTitle: teacher.pdfTitle,
  }));
}




export async function createTeacher(
  input: TeacherInput & { imageFile: File }
) {
  const uploaded = await saveFileLocally(
    input.imageFile,
    "teachers"
  );

  const teacher: Teacher = {
    id: crypto.randomUUID(),

    name: normalizeText(input.name),

    subject: normalizeText(input.subject),

    description: normalizeText(input.description),

    imageUrl: uploaded.publicPath,
  };

  const teachers = await getTeachers();

  await saveTeachers([
    teacher,
    ...teachers,
  ]);

  return teacher;
}


export async function updateTeacher(
 id:string,
 input:TeacherUpdateInput
){

 const teachers =
 await getTeachers();


 const existing =
 teachers.find(
  t=>t.id===id
 );


 if(!existing)
 return null;


 let imageUrl =
 existing.imageUrl;

 if (input.imageFile) {
  await deleteLocalFile(existing.imageUrl);

  const uploaded = await saveFileLocally(
    input.imageFile,
    "teachers"
  );

  imageUrl = uploaded.publicPath;
}

 const updated: Teacher = {
  ...existing,

  name: normalizeText(input.name),

  subject: normalizeText(input.subject),

  description: normalizeText(input.description),

  imageUrl,
};

 await saveTeachers(

  teachers.map(
   t=>
   t.id===id
   ? updated
   : t
  )

 );


 return updated;

}





export async function deleteTeacher(
  id: string
) {
  const teachers = await getTeachers();

  const existing = teachers.find(
    t => t.id === id
  );

  if (!existing) {
    return null;
  }

  await deleteLocalFile(
    existing.imageUrl
  );

  await saveTeachers(
    teachers.filter(
      t => t.id !== id
    )
  );

  return existing;
}