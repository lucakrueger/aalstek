# Aalstek-Service

Allstek-Service serves as the main API implementing all base features for the platform.

## Services

### Buckets

Manages Data Buckets.

### Auth

Provides a uniform interface to authenticate requests using e.g. Session Keys, JWT

### Actions

Handles everything regarding storing and retrieving actions.

## API

### Buckets

#### Bucket Info (GET)

> `/info/bucket/:author/:identifier`
>
> Get Information about Bucket
>
> ```ts
>response: {
>   author: string, // Bucket Name
>   created: string, // (Timestamp) Creation Date
>   name: string, // Bucket Name
>   description: string, // Bucket Description
>   (optional) failed: string  // Error Description
>}
> ```

#### Author Info (GET)

> `/info/author/:author`
>
> Get Information about Author.
>
> ```ts
>response: {
>   buckets: {
>       identifier: string,
>       name: string,
>       description: string
>   }[] // List of Buckets
>   (optional) failed: string // Error Description
>}
>```

#### Contents (GET)

> `/contents/:author/:identifier`
>
> Get Contents of Bucket
>
> ```ts
>response: {
>   value: any, // Bucket Data
>   (optional) failed: string  // Error Description
>}
> ```

#### Keys (GET)

> `/contents/:author/:identifier`
>
> Get Keys in Bucket
>
> ```ts
>response: {
>   keys: string[], // Bucket Keys
>   (optional) failed: string  // Error Description
>}
> ```

#### Retrieve (GET)

> `/retrieve/:author/:identifier/:key`
>
> Gets Key-Value from Bucket
>
> ```ts
>response: {
>   value: boolean,
>   (optional) failed: string  // Error Description
>}
> ```

#### Create (POST)

Bucket indentifiers are the name. (e.g. `user-data`)

> `/create/:author/:name`
>
> Creates new Storage Bucket
>
> ```ts
>request: {
>   created: string, // (Timestamp) Creation Date
>   description: string, // Bucket Description
>}
>
>response: {
>   identifier: string // Bucket identifier
>   (optional) failed: string  // Error Description
>}
> ```

#### Insert (POST)

> `/insert/:author/:identifier/:key`
>
> Inserts Key into Bucket
>
> ```ts
>request: {
>   value: any
>}
>
>response: {
>   inserted: boolean
>   (optional) failed: string  // Error Description
>}
> ```

#### Delete (DELETE)
> `/delete/:author/:identifier`
>
> Deletes Bucket
>
> ```ts
>response: {
>   deleted: boolean
>   (optional) failed: string // Error Description
>}
>```

#### Delete Key (DELETE)
> `/delete/:author/:identifier/:key`
>
> Deletes Key from Bucket
>
> ```ts
>response: {
>   deleted: boolean
>   (optional) failed: string // Error Description
>}
>```

### Auth

This feature is not implemented at the moment.

### Actions

#### Action Info (GET)

> `/info/action/:identifier`
>
> Get Information about Action
>
> ```ts
>response: {
>   author: string, // Author Name
>   created: string, // (Timestamp) Creation Date
>   name: string, // Action Name
>   description: string, // Action Description
>   paused: boolean, // Action Paused
>   source: string, // Source Code
>   (optional) failed: string  // Error Description
>}
> ```

#### Author Info (GET)

> `/info/author/:author`
>
> Get Information about Author.
>
> ```ts
>response: {
>   actions: {
>       identifier: string,
>       name: string,
>       description: string
>       paused: boolean,
>   }[] // List of actions
>   (optional) failed: string // Error Description
>}
>```

#### Store (POST)
> `/store/`
>
> `/store/:identifier`
>
> Stores new Action or Updates exisiting one
>
> ```ts
>request: {
>   author: string, // Author Name
>   created: string, // (Timestamp) Creation Date
>   name: string, // Action Name
>   description: string, // Action Description
>   paused: boolean, // Action Paused
>   source: string // Source Code
>}
>
>response: {
>   identifier: string // Action identifier
>   (optional) failed: string  // Error Description
>}
> ```

#### Pause (POST)
> `/pause/:identifier`
>
> Pauses Action
>
> ```ts
>response: {
>   paused: boolean // Status of Action
>   (optional) failed: string // Error Description
>}
>```

#### Unpause (POST)
> `/unpause/:identifier`
>
> Unpauses Action
>
> ```ts
>response: {
>   unpaused: boolean // Status of Action
>   (optional) failed: string // Error Description
>}
>```

#### Delete (DELETE)
> `/delete/:identifier`
>
> Deletes Action
>
> ```ts
>response: {
>   deleted: boolean
>   (optional) failed: string // Error Description
>}
>```