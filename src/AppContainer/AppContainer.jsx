import React from "react" ; 
import './AppContainer.css' 

const AppContainer = ({children}) => {
    return(
        <div className = "app-wrapper"> 
            <div className="app-content">
                {children}
            </div>
        </div>
    )
}

export default AppContainer ;