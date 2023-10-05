// Libraries imports
import React from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";

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
// import Invoices from "./scenes/invoices";
// import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
// import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Edit from "./scenes/user/Edit";
import Auction from "./scenes/auction";
import AuctionDetail from "./scenes/auctionDetail";
import Products from "./scenes/products";
import ProductDetail from "./scenes/productDetail";
import Orders from "./scenes/orders";
import OrderDetail from "./scenes/orderDetail";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
// import Calendar from "./scenes/calendar";

function App() {
  const location = useLocation();
  const [theme, colorMode] = useMode();
  // let user = "admin";
  // let user = "manager";
  let user = "staff";

  const getUser = () => {
    if (user === "admin") {
      return <Sidebar user={"admin"} />;
    } else if (user === "manager") {
      return <Sidebar user={"manager"} />;
    } else {
      return <Sidebar user={"staff"} />;
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app '>
          {/* check user role to print out sidebar */}
          {/* Pass the current location to Sidebar */}
          {window.location.pathname !== "/" && (
            <Sidebar user={user} currentLocation={location.pathname} />
          )}

          {/* <Sidebar /> */}
          <main className='content'>
            {window.location.pathname !== "/" && <Topbar />}

            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/team' element={<Team />} />
              <Route path='/admin' element={<Dashboard />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/form' element={<Form />} />
              <Route path='/user/:id' element={<UserDetail />} />
              <Route path='/edit/:id' element={<Edit />} />
              <Route path='/auctions' element={<Auction />} />
              <Route path='/auction/:id' element={<AuctionDetail />} />
              <Route path='/products' element={<Products />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/order/:id' element={<OrderDetail />} />
              <Route path='/bar' element={<Bar />} />
              <Route path='/pie' element={<Pie />} />
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
