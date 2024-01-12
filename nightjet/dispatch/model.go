package dispatch

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
)

const api = "http://localhost:3000"

func GetActionIdentifier(identifier string) (string, string, bool, bool, error) {
	var cachedAction CachedAction
	if err := GetCacheValue(identifier, &cachedAction); err == nil {
		return cachedAction.Source, cachedAction.Name, cachedAction.Paused, cachedAction.Cacheable, nil
	}

	response, err := GetRequest(strings.Join([]string{api, "/actions/info/action/", identifier}, ""))
	if err != nil {
		return "", "", false, false, err
	}

	if failed, exists := response["failed"]; exists {
		return "", "", false, false, errors.New(failed.(string))
	}

	cachedAction = CachedAction{
		response["source"].(string),
		response["name"].(string),
		response["paused"].(bool),
		response["cacheable"].(bool),
	}
	CacheValue(identifier, cachedAction)

	return response["source"].(string), response["name"].(string), response["paused"].(bool), response["cacheable"].(bool), nil
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
