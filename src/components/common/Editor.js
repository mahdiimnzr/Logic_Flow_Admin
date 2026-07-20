import React, { memo, useEffect, useRef } from "react";
import EditorJs from "@editorjs/editorjs";
import EditorJsTools from "./Tool";

const Editor = ({ data, onChange, editorBlock, placeholder, error }) => {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJs({
        holder: editorBlock,
        data: data,
        placeholder: placeholder,
        tools: EditorJsTools,
        async onChange(api, event) {
          const data = api.saver.save();
          onChange(data);
        },
      });
      ref.current = editor;
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  useEffect(() => {
    if (!ref.current || !data) return;

    ref.current.isReady.then(() => {
      ref.current.render(data);
    });
  }, [data]);

  return (
    <div
      id={editorBlock}
      className={`form-control ${error ? "is-invalid" : ""}`}
    ></div>
  );
};

export default memo(Editor);
