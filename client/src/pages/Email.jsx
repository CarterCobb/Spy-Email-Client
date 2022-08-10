import React, { Fragment, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fallback } from "../components/SuspenseUI";
import useEmails from "../hooks/useEmails";
import EmailAPI from "../api/email";
import Matrix from "../components/MatrixCanvas";
import Clock from "../components/Clock";
import RootPNG from "../assets/root.png";
import BGPNG from "../assets/logo-nsa.png";
import TrashPNG from "../assets/trash.png";
import MailPNG from "../assets/mail.png";
import { Dropdown, Menu, Modal, List } from "antd";
import GeneralAPI from "../api/general";
import { ls } from "../api/general";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMailSend, setLoadingMailSend] = useState(false);
  const [openMail, setOpenMail] = useState(false);
  const [openTrash, setOpenTrash] = useState(false);
  const [openSendEmail, setOpenSendEmail] = useState(false);
  const [rawData, setRawData] = useState(null);
  const [refreshedList, setRefreshedList] = useState([]);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [aes, setAes] = useState(false);
  const [sign, setSign] = useState(false);
  const [raw, setRaw] = useState(true);

  const navigate = useNavigate();
  const emails = useEmails();

  if (emails.loading) return fallback;
  if (emails.error) return <Navigate to="/" />;

  const refreshInbox = async () => {
    setLoading(true);
    const unseenEmails = await EmailAPI.refreshEmails();
    setRefreshedList([...unseenEmails, ...refreshedList]);
    setLoading(false);
  };

  const onRootMenuSelect = async (info) => {
    if (info.key === "logout") {
      const loggedOut = await GeneralAPI.logout();
      if (loggedOut) navigate("/");
    }
  };

  const onSendEmail = async (e) => {
    setLoadingMailSend(true);
    e.preventDefault();
    const sentEmail = await EmailAPI.sendEmail(to, subject, message, {
      aes,
      raw,
      sign,
    });
    if (sentEmail) {
      setOpenSendEmail(false);
      alert("Email Sent!");
    } else alert("Failed to Send Email :(");
    setTo("");
    setSubject("");
    setMessage("");
    setAes(false);
    setSign(false);
    setRaw(false);
    setLoadingMailSend(false);
  };

  const rootMenu = (
    <Menu
      rootClassName="footer-root-menu"
      selectable
      onSelect={onRootMenuSelect}
      items={[
        {
          label: <a href={window.location.href}>Refresh page</a>,
          key: "0",
        },
        {
          label: (
            <a
              href="https://github.com/CarterCobb/Spy-Email-Client"
              target="_blank"
              rel="noreferrer"
            >
              See Source Code
            </a>
          ),
          key: "1",
        },
        {
          type: "divider",
        },
        {
          label: "Logout",
          key: "logout",
        },
      ]}
    />
  );

  return (
    <Fragment>
      <Matrix style={{ opacity: 0.95 }} />
      <div className="desktop-container">
        <img src={BGPNG} alt="nsa" className="desktop-background-img" />
        <div className="desktop-app">
          <div
            className="desktop-app-container"
            onClick={() => setOpenTrash(true)}
          >
            <img src={TrashPNG} alt="trash" className="desktop-button" />
            <h3>Trash</h3>
          </div>
          <div
            className="desktop-app-container"
            onClick={() => setOpenMail(true)}
          >
            <img src={MailPNG} alt="mail" className="desktop-button" />
            <h3>Mail</h3>
          </div>
        </div>
      </div>
      <div className="footer-bar">
        <Clock />
        <Dropdown overlay={rootMenu} trigger={["click"]} placement="top">
          <img src={RootPNG} alt="root" className="footer-root" />
        </Dropdown>
      </div>
      <Modal
        title="Trash"
        closeIcon={<span>X</span>}
        visible={openTrash}
        footer={null}
        centered
        mask={false}
        onCancel={() => setOpenTrash(false)}
      >
        <p>No Trash :(</p>
      </Modal>
      <Modal
        title={`Spy Emails - ${JSON.parse(ls.get("@creds"))?.username}`}
        closeIcon={<span>X</span>}
        visible={openMail}
        footer={null}
        centered
        mask={false}
        onCancel={() => setOpenMail(false)}
        width={850}
      >
        <div className="emails-header">
          <p>Your Emails:</p>
          <div style={{ flexGrow: 1 }} />
          <div className="refresh-btn" onClick={() => refreshInbox()}>
            Refresh
          </div>
          <div className="new-email-btn" onClick={() => setOpenSendEmail(true)}>
            Send Email
          </div>
        </div>
        <List
          loading={loading}
          bordered
          pagination={{ pageSize: 2 }}
          itemLayout="horizontal"
          dataSource={[...refreshedList, ...emails.list]}
          renderItem={(email) => (
            <List.Item key={email.uid}>
              <List.Item.Meta
                title={
                  <div>
                    <span className="footer-email-data from">
                      From: {email.from}
                    </span>
                    <br />
                    Subject: <b>{email.subject}</b>
                  </div>
                }
                description={email.message}
              />
              <div className="footer-info-container">
                <span className="footer-email-data">
                  {new Date(email.received_at).toDateString()}
                </span>
                <span className="footer-email-data">
                  Signed:{" "}
                  <span
                    className={`email-signature ${email.signed && "verified"}`}
                  >
                    <b>{email.signed ? "YES" : "NO"}</b>
                  </span>
                </span>
                <span className="footer-email-data">
                  Verified:{" "}
                  <span
                    className={`email-signature ${
                      email.verified_signature && "verified"
                    }`}
                  >
                    <b>{email.verified_signature ? "YES" : "NO"}</b>
                  </span>
                </span>
                <div
                  className="footer-view-raw-data"
                  onClick={() => setRawData({ ...email.raw, uid: email.uid })}
                >
                  View Raw Data
                </div>
              </div>
            </List.Item>
          )}
        />
      </Modal>
      <Modal
        title={`Email ${rawData?.uid}'s raw data`}
        closeIcon={<span>X</span>}
        visible={rawData !== null}
        footer={null}
        centered
        onCancel={() => setRawData(null)}
      >
        <div>
          <span className="raw-data-title">
            Message:{" "}
            <span className="raw-data-content">{rawData?.message}</span>
          </span>
          <br />
          <span className="raw-data-title">
            Signature:{" "}
            <span className="raw-data-content">{rawData?.signature}</span>
          </span>
          <br />
          <span className="raw-data-title">
            RSA Encrypted AES Key:{" "}
            <span className="raw-data-content">{rawData?.encryption_key}</span>
          </span>
        </div>
      </Modal>
      <Modal
        title="Send Email"
        closeIcon={<span>X</span>}
        visible={openSendEmail}
        footer={null}
        centered
        onCancel={() => setOpenSendEmail(false)}
      >
        <form onSubmit={onSendEmail} className="send-email-form">
          <label>To:</label>
          <input
            className="send-email-field"
            value={to}
            onChange={({ target: { value } }) => setTo(value.toLowerCase())}
            placeholder="email(s) comma separated..."
          />
          <label>Subject:</label>
          <input
            className="send-email-field"
            value={subject}
            onChange={({ target: { value } }) => setSubject(value)}
          />
          <label>Message:</label>
          <textarea
            rows={4}
            cols={56}
            value={message}
            className="send-email-textarea"
            onChange={({ target: { value } }) => setMessage(value)}
          />
          <span>
            <input
              type="checkbox"
              checked={aes}
              onChange={() => {
                if (raw) setRaw(false);
                setAes(!aes);
              }}
            />
            <label className="send-email-settings-label">
              Encrypt with AES
            </label>
          </span>
          <span>
            <input
              type="checkbox"
              checked={sign}
              onChange={() => setSign(!sign)}
            />
            <label className="send-email-settings-label">
              Create a signature
            </label>
          </span>
          <span>
            <input
              type="checkbox"
              checked={raw}
              onChange={() => {
                if (aes) setAes(false);
                setRaw(!raw);
              }}
            />
            <label className="send-email-settings-label">
              Send raw with no AES encryption
            </label>
          </span>
          {loadingMailSend ? (
            <label className="send-email-settings-label load">Loading...</label>
          ) : (
            <input type="submit" value="Send" className="send-email-submit" />
          )}
        </form>
      </Modal>
    </Fragment>
  );
};

export default Home;
