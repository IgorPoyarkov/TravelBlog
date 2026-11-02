import type React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Configuration {
  title: string;
  navigate?: string;
  modifer?: string;
  children?: React.ReactNode;
}

interface ModalProps {
  configuration: Configuration;
}

const Modal = ({ configuration }: ModalProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  let navigateString: string = "";

  function onClose() {
    switch (configuration.navigate) {
      case "comment":
        navigateString = `/posts/${id}`;
        break;

      default:
        navigateString = "/";
        break;
    }

    navigate(navigateString);
  }

  const modifierClass = configuration.modifer
    ? `modal--${configuration.modifer}`
    : "";
  return (
    <div className={`modal ${modifierClass}`}>
      <div className="modal-wrapper">
        <button className="modal-btn btn" onClick={onClose}></button>
        <p className="modal-title"> {configuration.title}</p>
        <div className="modal-content">{configuration.children}</div>
      </div>
    </div>
  );
};

export default Modal;
