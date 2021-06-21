# Intuitive state management solution

> Important! Currently in ideation state

```bash
npm i cor-state
```


## Configuration

You can get any field by calling `c` with the field you want to access from the useCor.
To batch updates you can set the fields `c({ count: 0, name: "Back to no name again" });`

```js
// AnyComponent.js
function AnyComponent() {
  const { c } = useCor({
    keys: ["count", "name"], // rerenders only if count and name changes
    defaultValues: { // optional default values
      count: 0,
      name: "No name"
    }
  });
  return (
    <div>
      <p>{c("count")}</p>
      <p>{c("name")}</p>
      <button onClick={() => c({ count: c("count") + 1 })}>Set count</button>
      <input
        value={c("name")}
        placeholder="set name"
        onChange={(event) => c({ name: event.target.value })}
      />
      <button
        onClick={() => {
          c({ count: 0, name: "Back to no name again" });
        }}
      >
        Reset
      </button>
    </div>
  );
}
  
 
```

