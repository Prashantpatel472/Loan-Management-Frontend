import axios from "axios";
import { getLocalStorageData } from "../common/utility";

// Default config options
const defaultOptions = {
    baseURL: "http://localhost:8080/",
    headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
};

//Create axios instance
const publicRequest = axios.create(defaultOptions);

// Set the AUTH token for any request
publicRequest.interceptors.request.use(function (config) {
    const token = getLocalStorageData("loggedUser")?.token;
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
});

/**
 *  @param {Object} reqObj
 *  @param {('GET'|'DELETE'|'PUT'|'POST'|PATCH)}
 *  @param {String} params The request's body
 *  @param {Object} body The request's body
 */

const agent = async (reqObj) => {
    let result;
    const response = await publicRequest(reqObj);
    try {
        result = await response.data;
    } catch (error) {
        result = { errors: { status: error.response.statusText } };
    }
    if (response.status !== 200) throw result;

    return result;
};

const requestsApi = {
    /**
     * Send a GET request
     *
     * @param {String} url The endpoint
     * @param {Object} [params]
     * @returns {Promise<Object>}
     */
    getRequest: (url, params = "") =>
        agent({
            method: "GET",
            url: url,
            params: params,
        }),
    /**
     * Send a POST request
     *
     * @param {String} url The endpoint
     * @param {Object} body The request's body
     */
    postRequest: (url, body) =>
        agent({
            method: "POST",
            url: url,
            data: body,
        }),
    /**
     * Send a PUT request
     *
     * @param {String} url The endpoint
     * @param {Object} postData The request's body
     */
    putRequest: (url, postData) =>
        agent({
            method: "PUT",
            url: url,
            data: postData,
        }),
    /**
     * Send a PATCH request
     *
     * @param {String} url The endpoint
     */
    patchRequest: (url) =>
    agent({
        method: "PATCH",
        url: url,
    }),
    /**
     * Send a DELETE request
     *
     * @param {String} url The endpoint
     * @returns {Promise<Object>}
     */
    deleteRequest: (url) =>
        agent({
            method: "DELETE",
            url: url,
        }),
    mutipleDeleteRequest: (url, postData) =>
        agent({
            method: "DELETE",
            url: url,
            data: postData,
        }),
};

export default requestsApi;
