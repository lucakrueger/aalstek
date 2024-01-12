package dispatch

import (
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/chenyahui/gin-cache/persist"
)

var Cache *persist.MemoryStore

type CachedAction struct {
	Source    string
	Name      string
	Paused    bool
	Cacheable bool
}

type CachedRequest struct {
	Response map[string]interface{}
}

func BuildCache() {
	Cache = persist.NewMemoryStore(time.Minute * 1)
}

func GetCacheValue(key string, value interface{}) error {
	return Cache.Get(key, value)
}

func CacheValue(key string, value interface{}) error {
	return Cache.Set(key, value, time.Minute*1)
}

func HashRequest(uri string, body string) string {
	hash := sha256.New()
	hash.Write(append([]byte(uri), []byte(body)...))
	return hex.EncodeToString(hash.Sum(nil))
}
