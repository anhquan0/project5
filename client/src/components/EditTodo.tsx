import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/todos-api'

enum FileUploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  name: string
  file: any
  fileUploadState: FileUploadState
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    name: '',
    file: undefined,
    fileUploadState: FileUploadState.NoUpload,
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    const {file} = this.state

    try {
      if (!file) {
        alert('File should be selected')
        return
      }

      this.setFileUploadState(FileUploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId)

      this.setFileUploadState(FileUploadState.UploadingFile)
      await uploadFile(uploadUrl, file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setFileUploadState(FileUploadState.NoUpload)
    }
  }

  setFileUploadState(fileUploadState: FileUploadState) {
    this.setState({
      fileUploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Update Todo</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.fileUploadState === FileUploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.fileUploadState === FileUploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.fileUploadState !== FileUploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
