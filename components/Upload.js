import { useState } from "react";
import { useS3Upload } from "next-s3-upload";

export default function UploadImages() {
  const [urls, setUrls] = useState([]);
  const { uploadToS3 } = useS3Upload();

  const handleFilesChange = async ({ target }) => {
    const files = Array.from(target.files);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const { url } = await uploadToS3(file);

      setUrls((current) => [...current, url]);
    }
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        multiple={true}
        onChange={handleFilesChange}
      />

      <div>
        {urls.map((url, index) => (
          <div key={url}>
            <img src={url} />
          </div>
        ))}
      </div>
    </div>
  );
}
