import { useEffect, useState } from "react";
import "./App.css";
import ChatBot from "./components/ChatBot";
import ImgGen from "./components/ImgGen";
import ScaleLoader from "react-spinners/ScaleLoader";
import { decode as atob, encode as btoa } from "js-base64";
// import { themeChange } from 'theme-change'
function App() {

  const [keyAPI, SetKey] = useState("");
  const [chooseType, SetChooseType] = useState("");
  useEffect(() => {
    const options = { method: "GET" };
    fetch("https://raw.githubusercontent.com/phatjkk/data/main/m.txt", options)
      .then((response) => response.text())
      .then((response) => {
        SetKey(atob(response));
      })
      .catch((err) => console.error(err));
      
  }, []);
  return (
    <div className="App">
      <div className="flex justify-end">
      
        {chooseType !== "" ? (
          <button
            onClick={() => SetChooseType("")}
            className="mt-[1em] mr-3 btn-square btn btn-sm btn-error"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          ""
        )}
      </div>
      {keyAPI === "" ? (
        <ScaleLoader
          color="#ffffff"
          loading={true}
          height={10}
          width={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          {chooseType === "" ? (
            <div className="flex justify-center items-center h-screen">
            <div>
            <h1 className="text-center mb-3">Choose AI Tool ?</h1>
            <div className="flex">
                <button
                  className="btn btn-active btn-primary"
                  onClick={() => SetChooseType("Image Generate")}
                >
                  Image Generate
                </button>
                <button
                  className="ml-3 btn btn-active btn-accent"
                  onClick={() => SetChooseType("AI Chat")}
                >
                  AI Chat
                </button>
              </div>
            </div>
              
            </div>
          ) : chooseType === "AI Chat" ? (
            <ChatBot keyAPI={keyAPI} />
          ) : (
            <ImgGen keyAPI={keyAPI} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
