import * as React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { Form } from "./Components/Form";

export default function App() {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <Form />
        </div>
      </div>
    </div>
  );
}
