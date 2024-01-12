package dispatch

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
)

const api = "http://localhost:3000"

func GetActionIdentifier(identifier string) (string, string, bool, error) {
	response, err := GetRequest(strings.Join([]string{api, "/actions/info/action/", identifier}, ""))
	if err != nil {
		return "", "", false, err
	}

	if failed, exists := response["failed"]; exists {
		return "", "", false, errors.New(failed.(string))
	}

	return response["source"].(string), response["name"].(string), response["paused"].(bool), nil
}

func GetRequest(address string) (map[string]interface{}, error) {
	resp, err := http.Get(address)
	if err != nil {
		return nil, err
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response map[string]interface{}
	json.Unmarshal(data, &response)

	return response, nil
}
