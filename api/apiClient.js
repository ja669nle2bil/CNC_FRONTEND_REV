import axios from "axios";
import { CSHARP_API_URL, PYTHON_API_URL } from '@env';

const authApi = axios.create({
    baseURL: CSHARP_API_URL,    // Base URL for the C# auth api
});

const pythonApi = axios.create({
    baseURL: PYTHON_API_URL,    // Base URL for the Python backend.
});

export { authApi, pythonApi };