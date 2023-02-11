import avatar from "../assets/avatar.jpg";
import { useState, useRef, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import ScaleLoader from "react-spinners/ScaleLoader";



function ChatBot(props) {
  const configuration = new Configuration({
    apiKey: ""//props.keyAPI,
  });
  const openai = new OpenAIApi(configuration);

  async function CallAPI(prompt, size = 1000) {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.9,
        max_tokens: size,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
      });
      let text = response.data.choices[0].text

      return text
    } catch (error) {
      if (error.response) {
        return (
          "Error code " +
          error.response.status +
          ": " +
          error.response.data.error.message
        );
      } else {
        return "Error: " + error.message;
      }
      return 0;
    }
  }

  const messagesEndRef = useRef(null);
  let [promptInput, SetPromptInput] = useState("");
  let [isLoading, SetIsLoad] = useState(false);

  const [dataChat, SetDataChat] = useState([
    ["start", "Hello, how can I help you?"],
  ]);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [promptInput]);

  const onChangeHandler = (event) => {
    SetPromptInput(event.target.value);
  };

  function SendMessageChat() {
    if (promptInput !== "" && isLoading === false) {
      SetPromptInput("");
      SetIsLoad(true);
      SetDataChat((prev) => [...prev, ["end", promptInput]]);

      CallAPI(promptInput).then((response) => {
        SetDataChat((prev) => [...prev, ["start", response]]);
        SetIsLoad(false);
      });
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      SendMessageChat();
    }
  };
  return (
    <div className={"flex justify-center h-[90vh]"}>
      <div className="mt-5 md:w-[50%] md:p-0 p-1  w-full overflow-auto scroll-y-auto h-[80%]">
        {dataChat.map((dataMessages) =>
          dataMessages[0] === "start" ? (
            <div className="chat chat-start" key={dataMessages[0]}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full border-2 border-green-500">
                  <img src={avatar} />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-primary break-words">
              <p>
                {dataMessages[1].replace("\n\n","").split("\n").map((item, key) => {
                  return (
                    <>
                      {item.replace(/ /g, "\u00A0")}
                      <br />
                    </>
                  );
                })}
                </p>
              </div>
            </div>
          ) : (
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-info">{dataMessages[1]}</div>
            </div>
          )
        )}
        {isLoading ? (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={avatar} />
              </div>
            </div>
            <div className="chat-bubble chat-bubble-primary">
              <ScaleLoader
                color="#ffffff"
                loading={true}
                height={10}
                width={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div ref={messagesEndRef} />
        <div className="absolute bottom-3 md:w-[50%] grid grid-cols-12">
          <input
            type="text"
            placeholder="Type your question here..."
            className="mr-1 input input-bordered input-accent col-start-1 md:col-end-12 col-end-11"
            onChange={onChangeHandler}
            onKeyDown={handleKeyDown}
            value={promptInput}
          />

          <button
            onClick={() => SendMessageChat()}
            className={
              "md:col-start-12 col-start-11 col-end-12 md:col-end-13 btn btn-active btn-accent btn-square"
            }
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              color="white"
              height="15px"
              width="15px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChatBot;
