import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";

function ImgGen(props) {
  const configuration = new Configuration({
    apiKey: props.keyAPI,
  });
  const openai = new OpenAIApi(configuration);
  let [promptInput, SetPromptInput] = useState("");
  let [errorMessageAndStatus, SetErrorMessageAndStatus] = useState(["", ""]);
  let [numberImage, SetNumberImage] = useState(1);
  let [imageSize, SetImageSize] = useState("256x256");
  let [buttonTitle, SetButtonTitle] = useState("Generate Image");
  let [imageData, SetImageData] = useState([]);

  const onChangeHandler = (event) => {
    SetPromptInput(event.target.value);
  };

  function OnClickGenerateImage() {
    if (promptInput !== "") {
      SetErrorMessageAndStatus(["", ""]);
      SetButtonTitle("Generating...");
      CallAPI(promptInput, numberImage, imageSize).then((data) => {
        if (data !== 0) {
          SetImageData(data);
          console.log(data[0].url);
        }

        SetButtonTitle("Generate Image");
      });
    }
  }
  async function CallAPI(prompt, n, size) {
    try {
      const response = await openai.createImage({
        prompt: prompt,
        n: parseInt(n),
        size: size,
      });
      console.log(response);
      let image_url = response.data.data;
      return image_url;
    } catch (error) {
      if (error.response) {
        SetErrorMessageAndStatus([
          error.response.status,
          error.response.data.error.message,
        ]);
        console.log(error.response.status);
        console.log(error.response.data.error.message);
      } else {
        SetErrorMessageAndStatus(["", error.message]);
        console.log(error.message);
      }
      return 0;
    }
  }
  return (
    <>
      <div className={"m-3 flex justify-center"}>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">What is your idea?</span>
          </label>
          <input
            type="text"
            placeholder="Prompt..."
            className="input input-bordered w-full max-w-xs"
            onChange={onChangeHandler}
            value={promptInput}
          />

          <label className="label">
            <span className="label-text">Number of image?</span>
          </label>
          <select
            className="select select-bordered"
            value={numberImage}
            onChange={(e) => SetNumberImage(e.target.value)}
          >
            <option value={1} selected="selected">
              1
            </option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>

          <label className="label">
            <span className="label-text">Image size?</span>
          </label>
          <select
            className="select select-bordered"
            value={imageSize}
            onChange={(e) => SetImageSize(e.target.value)}
          >
            <option value={"256x256"} selected="selected">
              256x256
            </option>
            <option value={"512x512"}>512x512</option>
            <option value={"1024x1024"}>1024x1024</option>
          </select>
          <label className="label"></label>
          <button
            className={"btn btn-info "+(buttonTitle!=="Generate Image"?"hidden":"")}
            onClick={() => OnClickGenerateImage()}
          >
            {buttonTitle}
          </button>

          <button
            className={"btn btn-error "+(buttonTitle=="Generate Image"?"hidden":"")}
          >
            {buttonTitle}
          </button>
          {errorMessageAndStatus[1] !== "" ? (
            <div className="alert alert-error shadow-lg mt-6 h-fit">
              <div>
                <span>
                  Error {errorMessageAndStatus[0]}! {errorMessageAndStatus[1]}.
                </span>
              </div>
            </div>
          ) : (
            ""
          )}

          {imageData.map((image) => (
            <>
              <img className="mt-4" src={image.url} />
              <a className="link link-error" target="_blank" href={image.url} download="download" onClick={(e) => download(e)}>
                Download
              </a>
            </>
          ))}

        </div>
      </div>
    </>
  );
}

export default ImgGen;
