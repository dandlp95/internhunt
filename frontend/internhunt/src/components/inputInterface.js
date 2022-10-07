import { useEffect, useState } from "react";
import React from "react";
import { getApiRoot } from "../utils/getApiRoot";
import { useParams, Link, Route, Routes, useNavigate } from "react-router-dom";

const InputInterface = (props) => {
    return(
        <div>
            <input placeholder={props.placeholder}/>
        </div>
    )
}

export default InputInterface