package model

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const uri = "mongodb://root:root@localhost:64000/"

var MongoClient *mongo.Client

func ConnectDatabase() {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	var err error
	MongoClient, err = mongo.Connect(context.TODO(), opts)

	if err != nil {
		panic(err)
	}

	var result bson.M
	if err := MongoClient.Database("root").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Decode(&result); err != nil {
		panic(err)
	}
	fmt.Println("[MONGO] [INFO] Successfully connected to MongoDB")
}

func DisconnectDatabase() {
	if err := MongoClient.Disconnect(context.TODO()); err != nil {
		panic(err)
	}
}
