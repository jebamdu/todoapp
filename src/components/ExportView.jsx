import { MDBBtn, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalHeader, MDBModalTitle } from "mdb-react-ui-kit";
import { saveAs } from 'file-saver';
import { useEffect, useState, } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ExportView = ({ OpenExportModel, setOpenExportModel }) => {

    const [PAT, setPAT] = useState("");
    const [gistURL, setGistURL] = useState("");

    useEffect(() => {
        setPAT(localStorage.getItem('PAT'))
    }, [])

    function createmdFile(data, download = true) {
        let markdownContent =
            `## ` + data.title + "\n" +
            "##### Summary :" +
            (data.todo.length -
                data.todo.filter((data) => data.status === "pending").length) + "/" + data.todo.length + " todos completed\n";
        markdownContent += "#### Pending\n";
        data.todo
            .filter((data) => data.status === "pending")
            .forEach((value) => {
                markdownContent += `- [ ] ${value.description}\n`;
            });
        markdownContent += "#### Completed\n";
        data.todo
            .filter((data) => data.status !== "pending")
            .forEach((value) => {
                markdownContent += `- [x] ${value.description}\n`;
            });

        if (download) {
            const blob = new Blob([markdownContent], { type: 'text/markdown' });
            saveAs(blob, data.title + '.md'); // Save the file with name 'example.md'
        } else {
            return markdownContent
        }
    }

    const PATchange = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        localStorage.setItem('PAT', e.target.value)
        setPAT(e.target.value)
    }

    const uploadToGist = async () => {
        console.log(OpenExportModel)
        const PAT = localStorage.getItem("PAT")
        try {
            const res = await axios.post('https://api.github.com/gists', { "description": OpenExportModel.description, "public": false, "files": { [OpenExportModel.title + ".md"]: { "content": createmdFile(OpenExportModel, false) } } },
                { headers: { Authorization: "Bearer " + PAT } })
            console.log(res)
            setGistURL(res.data.html_url)
        } catch (error) {
            console.log(error)
            alert("Something went wrong while uploading", error);

        }
    }

    return (<MDBModal
        open={OpenExportModel}
        onClose={() => {
            setOpenExportModel(null);

        }}
        tabIndex="-1"
    >
        <MDBModalDialog scrollable>
            <MDBModalContent>
                <MDBModalHeader>
                    <MDBModalTitle>Export Project</MDBModalTitle>
                    <MDBBtn
                        className="btn-close"
                        color="none"
                        onClick={() => {
                            setOpenExportModel(null);

                        }}
                    ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                    <div className="d-flex justify-content-around align-items w-100">
                        <div className="w-100">
                            <h6>Personal Access Token</h6>
                            <textarea placeholder="Your Github Personal Access Token" className="form-control" onChange={PATchange} cols="30" rows="2">{PAT}</textarea>
                            <button className="mt-2 btn btn-primary" onClick={uploadToGist}>Upload to Github-Gist</button>
                            {gistURL && <><br /> <Link to={gistURL} target="_blank" >Click to view Gist</Link>
                               </>}
                        </div>
                        <div className=" w-100" >
                            <button className="m-5 h-40 w-50 btn btn-primary" onClick={() => createmdFile(OpenExportModel)}>Download as MD file
                            </button>
                        </div>
                    </div>
                </MDBModalBody>
            </MDBModalContent>
        </MDBModalDialog>
    </MDBModal >);
}

export default ExportView;