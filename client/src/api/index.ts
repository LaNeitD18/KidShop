import { BACKEND_URL } from './../constants/config';
import axios from "axios";

const API = axios.create({baseURL: BACKEND_URL})
export default API