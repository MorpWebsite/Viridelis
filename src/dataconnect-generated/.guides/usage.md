# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateNewUser, useGetCurrentUser, useAddNewPlant, useListSpecies } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateNewUser(createNewUserVars);

const { data, isPending, isSuccess, isError, error } = useGetCurrentUser(getCurrentUserVars);

const { data, isPending, isSuccess, isError, error } = useAddNewPlant(addNewPlantVars);

const { data, isPending, isSuccess, isError, error } = useListSpecies();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createNewUser, getCurrentUser, addNewPlant, listSpecies } from '@dataconnect/generated';


// Operation CreateNewUser:  For variables, look at type CreateNewUserVars in ../index.d.ts
const { data } = await CreateNewUser(dataConnect, createNewUserVars);

// Operation GetCurrentUser:  For variables, look at type GetCurrentUserVars in ../index.d.ts
const { data } = await GetCurrentUser(dataConnect, getCurrentUserVars);

// Operation AddNewPlant:  For variables, look at type AddNewPlantVars in ../index.d.ts
const { data } = await AddNewPlant(dataConnect, addNewPlantVars);

// Operation ListSpecies: 
const { data } = await ListSpecies(dataConnect);


```