import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Navigator from "../../components/Navigator/Navigator";
import "./HomePage.css";

function HomePage(){
    return(
        <div className="home-page-container">
            <Navigator/>
        </div>
    )
}

export default HomePage ; 