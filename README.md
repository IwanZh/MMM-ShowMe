# MMM-ShowMe
A module to display queries from Google on Magic Mirror

This is a module for displaying query content to Magic Mirror 

## Configuration
The entry in config.js can look like the following. (NOTE: You only have to add the variables to config if want to change its standard value.)

```Javascript
{
    module: 'MMM-ShowMe',
    position: "middle_center",
    config: {
        APIkey:"YOUR API KEY",
        cseID:"YOUR GOOGLE CUSTOM SEARCH ENGINE API KEY"
    }
}
```

## Usage
If you have setup the complementary GassistPi as instructed, you should be able to invoke it by saying "Hey Google, Show me!". Next you can say any of the following commands to trigger different actions on the Magic Mirror.

### Display text

The text in {} will be displayed on Magic Mirror in bold.

- `"Magic show me say {hello}"`
- `"Magic show me text {good morning}"`
- `"Magic show me images of {cute cats}"`
- `"Magic show me pictures of {great landscape}"`
- `"Magic show me videos of {people are amazing}"`
- `"Magic show me trailer of {iron man}"`

