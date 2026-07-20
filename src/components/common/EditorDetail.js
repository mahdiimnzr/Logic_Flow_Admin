import React from "react";

const CreateEditorJsBlocks = ({ editorData }) => {
  if (!editorData) return null;

  let editor = null;

  try {
    editor =
      typeof editorData === "string" ? JSON.parse(editorData) : editorData;
  } catch {
    return <p className="fs-5">{editorData}</p>;
  }

  if (!editor || !editor.blocks || !Array.isArray(editor.blocks)) {
    return <p className="fs-5">{editorData}</p>;
  }

  return (
    <>
      {editor.blocks.map((block, index) => {
        switch (block.type) {
          case "header":
            switch (block.data.level) {
              case 1:
                return <h1 key={index}>{block.data.text}</h1>;

              case 2:
                return <h2 key={index}>{block.data.text}</h2>;

              case 3:
                return <h3 key={index}>{block.data.text}</h3>;

              case 4:
                return <h4 key={index}>{block.data.text}</h4>;

              case 5:
                return <h5 key={index}>{block.data.text}</h5>;

              case 6:
                return <h6 key={index}>{block.data.text}</h6>;

              default:
                return <h2 key={index}>{block.data.text}</h2>;
            }

          case "paragraph":
            return (
              <p key={index} className="fs-5">
                {block.data.text}
              </p>
            );

          case "quote":
            return (
              <div
                key={index}
                className="my-4"
                style={{
                  backgroundColor: "#EFEEFE",
                  padding: "20px 32px",
                  display: "flex",
                  width: "83%",
                  marginInline: "auto",
                  borderRight: "5px solid #5751E1",
                  color: "#6D6C80",
                }}
              >
                <p className="w-100 m-0">{block.data.text}</p>
              </div>
            );

          case "list":
            return (
              <ul key={index} className="my-3">
                {block.data.items.map((item, i) => (
                  <li key={i} className="d-flex align-items-center gap-2 mb-2">
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        background: "#FFC224",
                        borderRadius: "50%",
                      }}
                    />

                    <span>
                      {typeof item === "string" ? item : item.content}
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "checklist":
            return (
              <div key={index} className="my-3">
                {block.data.items.map((item, i) => (
                  <label
                    key={i}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <input type="checkbox" checked={item.checked} readOnly />

                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
            );

          case "code":
            return (
              <pre
                key={index}
                className="p-3 rounded bg-dark text-white overflow-auto"
              >
                <code>{block.data.code}</code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default CreateEditorJsBlocks;
