# Sequence Matching

This is the repository of the sequence matching tool.

![home](https://github.com/kesler20/sequence_matching/blob/master/sequence%20matching%20image.png)

# Getting Started
Follow the instruction guide at [seqMGuide](https://scribehow.com/shared/How_To_Submit_Data_and_Download_Results__gC83MR_rSq2MSATGuP2zkA)

or [SDIGuide](https://github.com/kesler20/sequence_matching/blob/master/supporting_information/HowToSubmitDataandDownloadResults_PDF_2024-12-04080111.357514.pdf)

> **Note**: Make sure that you have one of the BiopharmaFinder versions below

| Version | Release Date | Change Log                                                                                      | Validated | Reference                                                                                                     |
|---------|--------------|------------------------------------------------------------------------------------------------|-----------|---------------------------------------------------------------------------------------------------------------|
| 5.0     | 2023         | Workflow-driven experiment creation, method processing, and result review                      | ✅       | [Release Notes](https://assets.thermofisher.com/TFS-Assets/CMD/manuals/man-xcali-98421-biopharma-finder-50-release-manxcali98421-en.pdf) |
| 5.3     | 2024         | Enhanced peptide mapping, oligonucleotide analysis, intact protein analysis, top-down analysis | ❌       | [Product Page](https://www.thermofisher.com/order/catalog/product/B51001849)                                 |


# Installation

### Python code
For installing running the python code create a virtual environment on powershell
```bash
python -m venv wiz-app-env
```
and activate it
```bash
wiz-app-env/scripts/activate.ps1
```
install all the requirements

```bash
pip install -r requirements.txt
```

install the module in edit mode
```bash
pip install -e .
```

### Frontend
For the frontend, run
```bash
npm install
```

## TODOs
- [ ] complete installation instruction
- [ ] provide the .gist with the credentials
