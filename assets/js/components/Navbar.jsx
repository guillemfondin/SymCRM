import React, { useContext } from 'react';
import AuthAPI from '../services/AuthAPI';
import { NavLink } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Navbar = ({ history }) => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        history.push("/login");
    }

    return ( 
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">Sym CRM</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/customers">Clients</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/invoices">Factures</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {!isAuthenticated && 
                        <>
                            <li className="nav-item">
                                <NavLink to="/register" className="nav-link">Inscription</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className="btn btn-success">Connexion</NavLink>
                            </li>
                        </> ||
                        <li className="nav-item">
                            <button onClick={handleLogout} className="btn btn-danger">Déconnexion</button>
                        </li>
                    }
                </ul>
            </div>
        </nav>
   );
}
 
export default Navbar;