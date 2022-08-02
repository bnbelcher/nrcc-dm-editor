# Drought Monitor Editor

## About this project

This project provides editable maps of the current U.S. Drought Monitor. Edited maps can be saved and shared with colleagues when collaborating on potential updates to the Drought Monitor each week.

In production at https://dm-editor.nrcc.cornell.edu/.

## Procedure for adding regions

A python script is provided that generates all required regional JSON files (createDMEditorRegionFiles.py). Please read the docstring inside the script for instructions on setting up regions and placing output JSON files.

```shell
$ python createDMEditorRegionFiles.py
```


