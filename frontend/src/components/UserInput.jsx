import React from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
// import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
// import Downshift from "downshift";

// const useStyles = makeStyles(theme => ({
//   chip: {
//     margin: theme.spacing(0.5, 0.25)
//   }
// }));

export default function TagsInput({ selectedTags, tags, ...other }) {
  // const classes = useStyles();
  // const { selectedTags, tags, ...other } = props;
  const [inputValue, setInputValue] = React.useState("");
  // const [tags, selectedTags] = React.useState([]);
  // useEffect(() => {
  //   selectedTags(tags);
  // }, [tags]);
  // useEffect(() => {
  //   selectedTags(tags);
  // }, [tags, selectedTags]);

  function handleKeyDown(event) {
    console.log(event.target.value)
    if (event.key === "Enter") {
      console.log("enter key is pressed")

      const newSelectedItem = [...tags];
      const duplicatedValues = newSelectedItem.indexOf(
        event.target.value.trim()
      );

      if (duplicatedValues !== -1) {
        setInputValue("");
        return;
      }

      if (!event.target.value.replace(/\s/g, "").length) return;

      newSelectedItem.push(event.target.value.trim());
      selectedTags(newSelectedItem);
      console.log("enter key is pressed",newSelectedItem)

      selectedTags(newSelectedItem)
      setInputValue("");
      event.target.value = '';
    }
    if (
      tags.length &&
      !inputValue.length &&
      event.key === "Backspace"
    ) {
      selectedTags(tags.slice(0, tags.length - 1));
    }
  }
  function handleChange(item) {
    let newSelectedItem = [...tags];
    if (newSelectedItem.indexOf(item) === -1) {
      newSelectedItem = [...newSelectedItem, item];
    }
    setInputValue("");
    selectedTags(newSelectedItem);
  }

  const handleDelete = item => () => {
    const newSelectedItem = [...tags];
    newSelectedItem.splice(newSelectedItem.indexOf(item), 1);
    selectedTags(newSelectedItem);
  };

  function handleInputChange(event) {
    setInputValue("");
    console.log(event)
  }
  return (
    <>
      {/* <Downshift
        id="downshift-multiple"
        >
        {({ getInputProps }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            placeholder
          }); */}

      <div>
        <TextField
          // tags={tags}
          inputValue={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          InputProps={{
            startAdornment: tags.map(item => (
              <Chip
                key={item}
                tabIndex={-1}
                label={item}
                // className={classes.chip}
                onDelete={handleDelete(item)}
              />
            )),
            // onBlur,
            onChange: event => {
              handleInputChange(event);
              // onChange(event);
            },
            // onFocus
          }}
          {...other}
        // {...inputProps}
        />
      </div>

      {/* }} */}
      {/* </Downshift> */}
    </>
  );
}
TagsInput.defaultProps = {
  tags: []
};
TagsInput.propTypes = {
  selectedTags: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string)
};
