import React, { useEffect, useState, useContext } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode"; // Import JWT decoding library
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Local imports
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./global/Topbar";
import Sidebar from "./global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Admin from "./scenes/admin";
import Login from "./scenes/login";
import Form from "./scenes/form";
import { Detail as UserDetail } from "./scenes/user";
import Bar from "./scenes/bar";
import Pie from "./scenes/pie";
import Edit from "./scenes/user/Edit";
import Auction from "./scenes/auction";
import AuctionDetail from "./scenes/auctionDetail";
import Products from "./scenes/products";
import ProductDetail from "./scenes/productDetail";
import Orders from "./scenes/orders";
import OrderDetail from "./scenes/orderDetail";
import AuctionProducts from "./scenes/auctionProduct";
import { fetchUserData } from "./libs/accountServices";
import AuctionManager from "./scenes/auction/index copy";
import Error from "./global/Error";
import Live from "./scenes/live";
import Profile from "./scenes/profile";
import SellerRequest from "./scenes/sellerReq";
import { SignalRContext } from "./context/SignalRContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangePassword from "./scenes/password";
import Withdraw from "./scenes/withdraw";

function App() {
  // let role = "admin";
  // let role = "manager";
  let role = "staff";
  const location = useLocation();
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState(null); // State to store user role
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Signal R context
  const signalRContext = useContext(SignalRContext);

  // Establish signal R connection
  useEffect(() => {
    if (signalRContext?.connection) {
      signalRContext.connection
        .start()
        .then(() => {
          signalRContext.connection.on("ReceiveMessage", (user, message) => {});

          signalRContext.connection.on(
            "ReceiveNewBid",
            (userName, auctionTitle) => {}
          );

          signalRContext.connection.on("ReceiveAuctionOpen", (auctionTitle) => {
            toast.success(`'${auctionTitle}' đã bắt đầu!`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });

          signalRContext.connection.on("ReceiveAuctionEnd", (auctionTitle) => {
            toast.success(`'${auctionTitle}' đã kết thúc!`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });

          signalRContext.connection.on(
            "ReceiveAuctionAboutToEnd",
            (auctionTitle) => {
              toast.success(`'${auctionTitle}' chuẩn bị kết thúc!`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }
          );

          signalRContext.connection.on(
            "ReceiveAuctionAssigned",
            (auctionId, auctionTitle) => {
              toast.success(`'${auctionTitle}' đã được giao cho bạn!`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              signalRContext.connection
                ?.invoke("JoinGroup", `AUCTION_${auctionId}`)
                .catch(function (err) {
                  return console.error(err.toString());
                });
            }
          );
        })
        .catch((error) => {});
    }

    return () => {
      if (signalRContext?.connection) {
        signalRContext.connection
          .stop()
          .then(() => {})
          .catch((err) => {});
      }
    };
  }, [signalRContext?.connection]);

  useEffect(() => {
    // Check if the user is logged in
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return;
    }

    const userRole = localStorage.getItem("role");
    if (!userRole) {
      return;
    }
    setUser(userRole);
    return () => {
      setUser(null);
    };
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App'>
          {/* Check if user is logged in to print out sidebar */}
          {/* Pass the current location to Sidebar */}
          {location.pathname !== "/login" &&
            location.pathname !== "/" &&
            location.pathname !== "/error" && (
              <Sidebar user={user} currentLocation={location.pathname} />
            )}

          <main className='content'>
            {/* Check if user is logged in */}
            {location.pathname !== "/login" && location.pathname !== "/" && (
              <Topbar />
            )}
            <ToastContainer />
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/login' element={<Login />} />
              <Route path='/team' element={<Team />} />
              <Route path='/admin' element={<Dashboard />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/form' element={<Form />} />
              <Route path='/user/:id' element={<UserDetail />} />
              <Route path='/edit/:id' element={<Edit />} />
              <Route
                path='/auctions'
                element={<Auction userId={localStorage.userId} />}
              />
              <Route path='/auctions/manager' element={<AuctionManager />} />
              <Route path='/auction/:id' element={<AuctionDetail />} />
              <Route path='/products' element={<Products />} />
              <Route path='/auctionProducts' element={<AuctionProducts />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/orders/:id' element={<OrderDetail />} />
              <Route path='/bar' element={<Bar />} />
              <Route path='/pie' element={<Pie />} />
              <Route path='/error' element={<Error />} />
              <Route path='/auction/live/:id' element={<Live />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/sellerRequest' element={<SellerRequest />} />
              <Route path='/withdrawal' element={<Withdraw />} />
              <Route path='/user/changePassword' element={<ChangePassword />} />
              {/* <Route path='/invoices' element={<Invoices />} /> */}
              {/* <Route path='/contacts' element={<Contacts />} /> */}
              {/* <Route path='/line' element={<Line />} /> */}
              {/* <Route path='/faq' element={<FAQ />} /> */}
              {/* <Route path='/geography' element={<Geography />} /> */}
              {/* <Route path='/calendar' element={<Calendar />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
