const fs = require('fs/promises');

(async()=>{
  try {
    const files = await fs.readdir(process.cwd(),{ withFileTypes: true });
    for (const file of files) {
      console.log(file.name);
      if (file.isFile()){
        const content = await fs.readFile(file.name,"utf8")
        if(file.name.includes("generate.sh")){
          console.log(content)
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
})()