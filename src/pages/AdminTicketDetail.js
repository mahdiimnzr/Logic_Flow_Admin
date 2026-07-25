import React, { useState, useEffect, useRef, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Spinner,
  Badge,
} from "reactstrap";
import { Send, User, MessageSquare, CornerUpLeft } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import BreadCrumbs from "@components/breadcrumbs";
import { useSkin } from "@hooks/useSkin";

import {
  getTicketDetailUser,
  sendTicketMessageAdmin,
  getTicketAutoComplete,
} from "../core/services/api/ticket/ticket.service";
import formatDate from "../core/utils/formatDate";
import { useTranslation } from "react-i18next";

const AdminTicketDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { skin } = useSkin();

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const chatEndRef = useRef(null);

  const {
    data: ticketDetail,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminTicketDetail", id],
    queryFn: () => getTicketDetailUser(id),
    enabled: !!id,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticketDetail]);

  useEffect(() => {
    const words = newMessage.split(" ");
    const lastWord = words[words.length - 1];

    if (!lastWord.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const res = await getTicketAutoComplete(lastWord);
      if (res && res.length > 0) {
        setSuggestions(res);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [newMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    const result = await sendTicketMessageAdmin({
      text: newMessage,
      ticketId: id,
    });

    const isSuccess =
      result &&
      (result.success === true ||
        result.id !== undefined ||
        result.status === 200);

    if (isSuccess) {
      setNewMessage("");
      setSuggestions([]);
      refetch();
    } else {
      toast.error(t("ErrorOnSending"));
    }
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner color="primary" />
      </div>
    );
  }

  if (!ticketDetail) {
    return <div className="text-center py-5">{t("TicketNotFound")}</div>;
  }

  const isClosed = ticketDetail.isDone;

  return (
    <Fragment>
      <BreadCrumbs
        title={t("TicketDetail")}
        data={[
          { title: t("TicketsManagement") },
          { title: t("TicketsList") },
          { title: t("TicketChat") },
        ]}
      />

      <Card className="chat-application">
        <CardHeader className="border-bottom d-flex justify-content-between align-items-center py-1">
          <div className="d-flex align-items-center gap-1">
            <Button
              color="flat-secondary"
              className="btn-icon rounded-circle"
              onClick={() => navigate(-1)}
            >
              <CornerUpLeft size={18} />
            </Button>
            <div>
              <h5 className="mb-0 fw-bolder d-flex align-items-center gap-50">
                {ticketDetail.problem}
              </h5>
              <small className="text-muted d-flex align-items-center gap-50 mt-25">
                {t("UserId")}: {ticketDetail.userId} | {t("Status")}:{" "}
                {isClosed ? (
                  <Badge color="light-secondary" pill>
                    {t("Closed")}
                  </Badge>
                ) : (
                  <Badge color="light-success" pill>
                    {t("Open")}
                  </Badge>
                )}
              </small>
            </div>
          </div>
        </CardHeader>

        <CardBody
          className={`d-flex flex-column gap-2 overflow-y-auto ${
            skin === "dark" ? "bg-dark" : "bg-light"
          }`}
          style={{ height: "55vh" }}
        >
          <div className="d-flex justify-content-start">
            <div style={{ maxWidth: "75%" }}>
              <div className="d-flex align-items-center gap-50 mb-25">
                <div className="avatar bg-light-secondary avatar-sm">
                  <span className="avatar-content">
                    <User size={14} />
                  </span>
                </div>
                <small className="text-muted">{t("User")}</small>
              </div>
              <div
                className={`p-1 rounded-3 shadow-sm ${
                  skin === "dark"
                    ? "bg-secondary text-white"
                    : "bg-white text-body"
                }`}
                style={{ borderTopLeftRadius: "0" }}
              >
                <p className="mb-0 lh-base" style={{ whiteSpace: "pre-wrap" }}>
                  {ticketDetail.describe}
                </p>
              </div>
              <small
                className="text-muted d-block mt-25"
                style={{ fontSize: "0.7rem" }}
              >
                {ticketDetail.insetDate
                  ? formatDate(ticketDetail.insetDate)
                  : ""}
              </small>
            </div>
          </div>

          {ticketDetail.ticketMessages &&
            ticketDetail.ticketMessages.map((msg) => {
              const isAdmin = msg.isSupport === true;
              return (
                <div
                  key={msg.id}
                  className={`d-flex ${
                    isAdmin ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  <div style={{ maxWidth: "75%" }}>
                    <div
                      className={`d-flex align-items-center gap-50 mb-25 ${
                        isAdmin
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      {isAdmin ? (
                        <Fragment>
                          <small className="text-muted">{t("Supporter")}</small>
                          <div className="avatar bg-primary avatar-sm">
                            <span className="avatar-content">
                              <MessageSquare size={14} />
                            </span>
                          </div>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div className="avatar bg-light-secondary avatar-sm">
                            <span className="avatar-content">
                              <User size={14} />
                            </span>
                          </div>
                          <small className="text-muted">{t("User")}</small>
                        </Fragment>
                      )}
                    </div>

                    <div
                      className={`p-1 rounded-3 shadow-sm ${
                        isAdmin
                          ? "bg-primary text-white"
                          : skin === "dark"
                          ? "bg-secondary text-white"
                          : "bg-white text-body"
                      }`}
                      style={
                        isAdmin
                          ? { borderTopRightRadius: "0" }
                          : { borderTopLeftRadius: "0" }
                      }
                    >
                      <p
                        className="mb-0 lh-base"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {msg.text || msg.message}
                      </p>
                    </div>

                    <small
                      className={`text-muted d-block mt-25 ${
                        isAdmin ? "text-end" : "text-start"
                      }`}
                      style={{ fontSize: "0.7rem" }}
                    >
                      {msg.insertDate ? formatDate(msg.insertDate) : ""}
                    </small>
                  </div>
                </div>
              );
            })}

          <div ref={chatEndRef} />
        </CardBody>

        <CardFooter className="border-top">
          {isClosed ? (
            <div className="text-center text-muted p-1 bg-light rounded">
              {t("TicketIsClose")}
            </div>
          ) : (
            <form
              onSubmit={handleSendMessage}
              className="d-flex align-items-center gap-1"
            >
              <div className="position-relative flex-grow-1">
                {showSuggestions && suggestions.length > 0 && (
                  <ul
                    className={`list-group position-absolute w-100 shadow-lg ${
                      skin === "dark" ? "bg-dark" : "bg-white"
                    }`}
                    style={{
                      bottom: "100%",
                      marginBottom: "5px",
                      maxHeight: "160px",
                      overflowY: "auto",
                      zIndex: 10,
                      borderRadius: "8px",
                    }}
                  >
                    {suggestions.map((item) => (
                      <li
                        key={item.id}
                        className={`list-group-item list-group-item-action cursor-pointer ${
                          skin === "dark"
                            ? "bg-dark text-white border-secondary"
                            : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const words = newMessage.split(" ");
                          words[words.length - 1] = item.text;
                          setNewMessage(words.join(" ") + " ");
                          setShowSuggestions(false);
                        }}
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}

                <Input
                  type="text"
                  placeholder={t("SendPlaceHolder")}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onFocus={() =>
                    suggestions.length > 0 && setShowSuggestions(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  disabled={isSending}
                  className="w-100"
                  autoFocus
                />
              </div>

              <Button
                color="primary"
                type="submit"
                disabled={isSending || !newMessage.trim()}
                className="d-flex align-items-center gap-50"
              >
                <Send size={16} className={isSending ? "d-none" : ""} />
                {isSending ? (
                  <Spinner size="sm" />
                ) : (
                  <span className="d-none d-sm-inline">{t("Send")}</span>
                )}
              </Button>
            </form>
          )}
        </CardFooter>
      </Card>
    </Fragment>
  );
};

export default AdminTicketDetail;
