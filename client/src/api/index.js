import axios from 'axios';
import { BACKEND_URL } from '../constants/config';

const API = axios.create({ baseURL: BACKEND_URL });
export default API;
