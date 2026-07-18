import {
  deleteImageFromCloudinary,
  getOptimizedCloudinaryImageUrl,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";

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



function getTeachersFolder(){

 const baseFolder =
 process.env.CLOUDINARY_FOLDER ??
 "cica-institute";

 return `${baseFolder}/teachers`;

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





export async function listTeacherStaffMembers()
:Promise<StaffMember[]>{

 const teachers =
 await getTeachers();


 return teachers.map(
  teacher=>({

   id:teacher.id,

   name:teacher.name,

   subject:
   teacher.subject,

   bio:
   teacher.description,

   photo:
   teacher.imageUrl,

   publicId:
   teacher.publicId,

   pdfUrl:
   teacher.pdfUrl,

   pdfTitle:
   teacher.pdfTitle

  })
 );

}




export async function createTeacher(
 input:
 TeacherInput &
 {imageFile:File}
){

 const upload =
 await uploadImageToCloudinary(
  input.imageFile,
  {
   title:input.name,
   category:"teacher",
   folder:getTeachersFolder()
  }
 );


 const teacher:Teacher={

  id:
  crypto.randomUUID(),

  name:
  normalizeText(input.name),

  subject:
  normalizeText(input.subject),

  description:
  normalizeText(input.description),

  imageUrl:
  getOptimizedCloudinaryImageUrl(
   upload.publicId
  ),

  publicId:
  upload.publicId

 };


 const teachers =
 await getTeachers();


 await saveTeachers(
  [
   teacher,
   ...teachers
  ]
 );


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


 let publicId =
 existing.publicId;



 if(input.imageFile){

  const uploaded =
  await uploadImageToCloudinary(
   input.imageFile,
   {
    title:input.name,
    category:"teacher",
    folder:getTeachersFolder()
   }
  );


  await deleteImageFromCloudinary(
   existing.publicId
  ).catch(()=>undefined);



  imageUrl =
  getOptimizedCloudinaryImageUrl(
   uploaded.publicId
  );


  publicId =
  uploaded.publicId;

 }



 const updated:Teacher={

  ...existing,

  name:
  normalizeText(input.name),

  subject:
  normalizeText(input.subject),

  description:
  normalizeText(input.description),

  imageUrl,

  publicId

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
 id:string
){

 const teachers =
 await getTeachers();


 const existing =
 teachers.find(
  t=>t.id===id
 );


 if(!existing)
 return null;



 await deleteImageFromCloudinary(
  existing.publicId
 ).catch(()=>undefined);



 await saveTeachers(
  teachers.filter(
   t=>t.id!==id
  )
 );


 return existing;

}