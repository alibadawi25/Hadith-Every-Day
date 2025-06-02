import React from "react";
import { Layout, Menu, Alert } from "antd";
import { WifiOutlined } from "@ant-design/icons";

const { Header } = Layout;

function AppHeader({ darkMode, currentView, setCurrentView, isOnline }) {
  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: darkMode ? "#fff" : "#001529",
          color: darkMode ? "#000" : "#fff",
        }}
      >
        {" "}
        <div
          style={{
            color: darkMode ? "#000" : "#fff",
            fontWeight: "bold",
            fontSize: "clamp(0.5rem, 5vw, 1rem)",
            marginRight: 24,
          }}
        >
          Hadith App
        </div>
        <Menu
          theme={darkMode ? "light" : "dark"}
          mode="horizontal"
          selectedKeys={[currentView]}
          onClick={(e) => setCurrentView(e.key)}
          style={{ flex: 1 }}
        >
          <Menu.Item key="hadith">Hadith</Menu.Item>
          <Menu.Item key="favorites">Favorites</Menu.Item>
        </Menu>
      </Header>

      {!isOnline && (
        <Alert
          message="You're currently offline"
          description="Don't worry! Your favorites and cached content are still available."
          type="info"
          icon={<WifiOutlined />}
          showIcon
          style={{
            margin: 0,
            borderRadius: 0,
            border: "none",
            borderBottom: "1px solid #d9d9d9",
            backgroundColor: darkMode ? "#1f1f1f" : "#f6ffed",
            color: darkMode ? "#fff" : "#000",
          }}
          className={darkMode ? "dark-mode-alert" : ""}
          closable={false}
        />
      )}
    </>
  );
}

export default AppHeader;
