import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { io } from "socket.io-client";

const PublicVapIdKey =
  "BPYVpcC9ihPlKnl5Jn4_vewLx6II7CjjoQeb3AbhaysVjwtHv3Pddf2cLb-wNx6ltVt8XPHASWKJP13zKn74Zao";
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function App() {
  // const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState<boolean>(true);
  const socket = io("https://u.darbast.app/test-notif", {
    transports: ["websocket"],
  });

  function requestPermission() {
    window.Notification.requestPermission().then((perm) => {
      console.log("Notification Permission Requested...");
      setLogs((perv) => [...perv, "Notification Permission Requested..."]);
      if (perm == "granted") {
        setHasNotificationPermission(true);
        console.log("Notification Permission Granted...");
        setLogs((perv) => [...perv, "Notification Permission Granted..."]);
        console.log("Registering service worker...");
        setLogs((perv) => [...perv, "Registering service worker..."]);
        navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
          console.log("Service Worker Registered...");
          setLogs((perv) => [...perv, "Service Worker Registered..."]);
          const options = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PublicVapIdKey),
          };
          console.log("Registering Push...");
          setLogs((perv) => [...perv, "Registering Push..."]);
          serviceWorkerRegistration.pushManager.subscribe(options).then(
            (pushSubscription) => {
              console.log(pushSubscription);
              console.log("Push Registered...");
              setLogs((perv) => [...perv, "Push Registered..."]);
              console.log("Sending Push...");
              setLogs((perv) => [...perv, "Sending Push..."]);
              socket.emit("subscribe_for_push_notifications", pushSubscription);
              console.log("Push Sent...");
              setLogs((perv) => [...perv, "Push Sent..."]);
            },
            (error) => {
              console.error(error);
              setLogs((perv) => [...perv, error]);
            }
          );
        });
      }
    });
  }

  useEffect(() => {
    socket.on("connect", () => {
      setLogs((perv) => [...perv, "Socket Connected"]);
      const engine = socket.io.engine;
      console.log(engine.transport.name);

      engine.on("close", (reason) => {
        console.log({ reason });
      });
    });

    socket.on("connect_error", (e) => {
      setLogs((perv) => [...perv, "Socket Connect Error"]);
      console.log(Object.getOwnPropertyDescriptors(e).message.value);
    });

    socket.on("disconnect", () => {
      setLogs((perv) => [...perv, "Socket Disconnected"]);
      console.log(socket.connected); // false
    });

    navigator.serviceWorker.ready.then(async (serviceWorkerRegistration) => {
      const subscription =
        await serviceWorkerRegistration.pushManager.getSubscription();
      console.log({ subscription });
      if (subscription) {
        setHasNotificationPermission(true);
        socket.emit("subscribe_for_push_notifications", subscription);
      } else {
        setHasNotificationPermission(false);
      }
    });
    // requestPermission();
  }, []);

  // const [deferredPrompt, setDeferredPrompt] = useState<Event>();
  // window.addEventListener("beforeinstallprompt", (e) => {
  //   e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
  //   setDeferredPrompt(e); // Save the event so it can be triggered later.
  //   console.log("beforeinstallprompt");
  //   // Update UI to notify the user they can add to the home screen
  // });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {!hasNotificationPermission && (
          <button
            onClick={() => {
              requestPermission();
            }}
          >
            request permission
          </button>
        )}
        <br />
        <h1></h1>
        <br />
        {hasNotificationPermission && (
          <button
            onClick={() => {
              console.log("Notification Requested...");
              setLogs((perv) => [...perv, "Notification Requested..."]);
              socket.emit("test_notification", {});
            }}
          >
            receive notification
          </button>
        )}
      </div>
      {logs.reverse().map((logItem) => (
        <>
          <h5>{logItem}</h5>
          <br />
        </>
      ))}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
