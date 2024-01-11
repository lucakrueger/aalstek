package model

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type RegistryEntry struct {
	Identifier string `json:"identifier"`
	Author     string `json:"author"`
	Name       string `json:"name"`
}

// Returns true if entry existed before, false if it just got inserted
func InsertRegistryEntry(identifier string, author string, name string) (bool, error) {
	_, err := LookupActionRegistryIdentifier(identifier)

	if err == nil {
		return true, nil
	}

	registryEntry := bson.M{
		"identifier": identifier,
		"author":     author,
		"name":       name,
	}

	_, err = MongoClient.Database("registry").Collection("actions").InsertOne(context.TODO(), registryEntry)

	if err != nil {
		return false, err
	}

	return false, nil
}

func LookupActionRegistryIdentifier(identifier string) (RegistryEntry, error) {
	filter := bson.M{"identifier": identifier}

	var result RegistryEntry
	err := MongoClient.Database("registry").Collection("actions").FindOne(context.TODO(), filter).Decode(&result)

	if err != nil {
		return RegistryEntry{}, err
	}

	return result, nil

}

func LookupActionRegistry(author string, name string) (RegistryEntry, error) {
	filter := bson.M{"author": author, "name": name}

	var result RegistryEntry
	err := MongoClient.Database("registry").Collection("actions").FindOne(context.TODO(), filter).Decode(&result)

	if err != nil {
		return RegistryEntry{}, err
	}

	return result, nil

}

func UpdateActionField(identifier string, key string, value interface{}) error {
	entry, err := LookupActionRegistryIdentifier(identifier)

	if err != nil {
		return err
	}

	update := bson.M{
		"$set": bson.M{
			key: value,
		},
	}

	filter := bson.M{"name": entry.Name}
	_, err = MongoClient.Database("actions").Collection(entry.Author).UpdateOne(context.TODO(), filter, update)

	if err != nil {
		return err
	}

	return nil
}

func UpdateAction(identifier string, author string, created string, name string, description string, paused bool, source string) (string, error) {
	filter := bson.M{"name": name}

	updatedDocument := bson.M{
		"$set": bson.M{
			"identifier":  identifier,
			"author":      author,
			"created":     created,
			"name":        name,
			"description": description,
			"paused":      paused,
			"source":      source,
		},
	}

	_, err := MongoClient.Database("actions").Collection(author).UpdateOne(context.TODO(), filter, updatedDocument, options.Update().SetUpsert(true))

	if err != nil {
		return "", err
	}

	_, err = InsertRegistryEntry(identifier, author, name)

	if err != nil {
		return "", err
	}

	return identifier, nil

}

func StoreAction(author string, created string, name string, description string, paused bool, source string) (string, error) {
	filter := bson.M{"name": name}

	var result bson.M
	err := MongoClient.Database("actions").Collection(author).FindOne(context.TODO(), filter).Decode(&result)

	if err != nil && err != mongo.ErrNoDocuments {
		return "", err
	}

	if err == mongo.ErrNoDocuments {
		// Create New Document
		rawIdentifier := uuid.New().String()
		identifier := strings.ReplaceAll(rawIdentifier, "-", "") // Clean up uuid

		return UpdateAction(identifier, author, created, name, description, paused, source)

	}

	return UpdateAction(result["identifier"].(string), author, created, name, description, paused, source)

}

func LookupAction(indentifier string) (bson.M, error) {
	entry, err := LookupActionRegistryIdentifier(indentifier)

	if err != nil {
		return bson.M{}, err
	}

	action, err := LookupActionInfo(entry)

	return action, err
}

func LookupActionInfo(entry RegistryEntry) (bson.M, error) {
	filter := bson.M{"name": entry.Name}

	var result bson.M
	err := MongoClient.Database("actions").Collection(entry.Author).FindOne(context.TODO(), filter).Decode(&result)

	return result, err
}

func LookupAuthorInfo(author string) ([]bson.M, error) {
	cursor, err := MongoClient.Database("actions").Collection(author).Find(context.TODO(), bson.M{})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(context.TODO())

	actions := []bson.M{}
	for cursor.Next(context.TODO()) {
		var result bson.M
		err = cursor.Decode(&result)

		if err != nil {
			return nil, err
		}

		actions = append(actions, bson.M{
			"_id":         result["_id"],
			"identifier":  result["identifier"],
			"name":        result["name"],
			"description": result["description"],
			"paused":      result["paused"],
		})
	}

	if err = cursor.Err(); err != nil {
		return nil, err
	}

	return actions, nil
}

func DeleteAction(identifier string) error {
	entry, err := LookupActionRegistryIdentifier(identifier)

	if err != nil {
		return err
	}

	_, err = MongoClient.Database("actions").Collection(entry.Author).DeleteOne(context.TODO(), bson.M{"identifier": identifier})

	if err != nil {
		return err
	}

	_, err = MongoClient.Database("registry").Collection("actions").DeleteOne(context.TODO(), bson.M{"identifier": identifier})

	return err
}
