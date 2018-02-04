import {
  AppBar, Checkbox, FlatButton, LinearProgress, RaisedButton, Step, StepLabel, Stepper,
  TextField
} from "material-ui";
import * as React from "react";
import EditorPanel from "../document/EditorPanel";
import "./CreateRepoPanel.css";

declare const AbortController: any;

export default class CreateRepoPanel
  extends React.Component<any, FormData> {

  private requestTimeout: any;

  constructor(props: any) {
    super(props);
    this.state = {
      valid1: true,
      valid2: false,
      valid3: false,
      finished: false,
      form1Loading: false,
      stepIndex: 0,
      form1: {
        enableSync: false,
        externalUrl: "",
        document: null
      },
      form2: {
        document: {}
      },
      form3: {
        name: "",
        tag: ""
      },
      form1Errors: {
        externalUrl: ""
      },
      form2Errors: {},
      form3Errors: {
        name: "",
      }
    };
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleForm1Change = this.handleForm1Change.bind(this);
    this.handleForm2Change = this.handleForm2Change.bind(this);
    this.handleForm3Change = this.handleForm3Change.bind(this);
    this.handleForm2Error = this.handleForm2Error.bind(this);
  }

  public render() {
    const { finished, stepIndex } = this.state;
    const contentStyle = { margin: "0 16px" };
    return (
      <div className="create-repo-panel">
        <AppBar
          title="Create Repository"
          showMenuIconButton={false}
        />
        <div className="stepper-header">
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>Synchronizing</StepLabel>
            </Step>
            <Step>
              <StepLabel>Create Document</StepLabel>
            </Step>
            <Step>
              <StepLabel>Repository info</StepLabel>
            </Step>
          </Stepper>
        </div>
        <div>
          <div style={contentStyle}>
            {finished ? (<p>Finished</p>) : (<div className="stepper-content">{this.getStepContent(stepIndex)}</div>)}
          </div>
        </div>
      </div>
    );
  }

  private handleNext(event: any) {
    event.preventDefault();
    const stepIndex = this.state.stepIndex;
    if ((stepIndex === 0 && this.state.valid1) ||
      (stepIndex === 1 && this.state.valid2) ||
      (stepIndex === 2 && this.state.valid3)) {
      let state: any = this.state;
      state.stepIndex = stepIndex + 1;
      state.finished = stepIndex >= 2;
      if (state.stepIndex === 1) {
        state.form2.document = JSON.stringify(state.form1.document || {});
      } else if (state.stepIndex === 2) {
        if (state.form2.outDocument && state.form2.outDocument.info) {
          state.form3.name = state.form2.outDocument.info.title || "";
          state.form3.tag = state.form2.outDocument.info.tag || "";
        }
      }
      this.setState(state);

      if (state.stepIndex === 0) {
        this.handleForm1Change();
      } else if (state.stepIndex === 1) {
        this.handleForm2Change();
      } else if (state.stepIndex === 2) {
        this.handleForm3Change();
      }

    }
    return false;
  }

  private handlePrev() {
    const stepIndex = this.state.stepIndex;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }

  private handleForm3Change(event?: any, newValue?: any) {
    let state = this.state as any;
    if (event) {
      state.form3[event.target.name] = newValue;
      if (event.target.required && newValue.trim() === "") {
        state.form3Errors[event.target.name] = event.target.name + " is required";
      } else {
        state.form3Errors[event.target.name] = "";
      }
    }
    state.valid3 = Object.keys(this.state.form3Errors)
      .filter(field => this.state.form3Errors[field] !== "").length === 0;
    this.setState(state);
  }

  private handleForm1Change(event?: any, newValue?: any) {
    let state = this.state as any;
    if (event) {
      state.form1[event.target.name] = newValue;
      if (event.target.required && newValue.trim() === "") {
        state.form1Errors[event.target.name] = event.target.name + " is required";
      } else {
        state.form1Errors[event.target.name] = "";
      }
    }
    state.valid1 = Object.keys(this.state.form1Errors)
      .filter(field => this.state.form1Errors[field] !== "").length === 0;
    if (!state.form1.enableSync) {
      state.valid1 = true;
    } else if (!state.form1.externalUrl) {
      state.valid1 = false;
    } else if (!state.form1.document) {
      state.valid1 = false;
    }
    state.form1.document = null;
    this.setState(state);

    if (state.form1.enableSync && state.form1.externalUrl) {
      this.fetchExternalDocument(state.form1.externalUrl);
    }
  }

  private fetchExternalDocument(url: string) {
    this.setState({ form1Loading: true });

    if (this.requestTimeout) {
      clearInterval(this.requestTimeout);
    }
    this.requestTimeout = setTimeout(() => {
      fetch(url).then(response => {
        if (response.status < 400) {
          response.json().then(document => {
            let state = this.state;
            state.form1.document = document;
            this.setState(state);
            this.setState({ form1Loading: false, valid1: true });
          }).catch(e => {
            let state = this.state;
            state.form1Errors.externalUrl = "Failed to fetch document: " + e.message;
            this.setState(state);
            this.setState({ form1Loading: false });
          });
        } else {
          let state = this.state;
          state.form1Errors.externalUrl =
            `Failed to fetch document: server responded with ${response.status} (${response.statusText})`;
          this.setState(state);
          this.setState({ form1Loading: false });
        }
      }).catch(e => {
        let state = this.state;
        state.form1Errors.externalUrl = "Failed to fetch document: " + e.message;
        this.setState(state);
        this.setState({ form1Loading: false });
      });
    }, 1000);
  }

  private handleForm2Change(event?: any, newValue?: any) {
    let state = this.state as any;
    if (event) {
      state.form2[event.target.name] = newValue;
      if (event.target.required && newValue.trim() === "") {
        state.form2Errors[event.target.name] = event.target.name + " is required";
      } else {
        state.form2Errors[event.target.name] = "";
      }
    }
    try {
      state.form2.outDocument = JSON.parse(state.form2.document);
      state.form2Errors["document"] = "";
    } catch (e) {
      state.form2Errors["document"] = "Invalid JSON";
    }
    state.valid2 = Object.keys(state.form2Errors)
      .filter(field => state.form2Errors[field] !== "").length === 0;
    this.setState(state);
  }

  private handleForm2Error(error: string): void {
    let state = this.state as any;
    state.form2Errors.document = error;
    this.setState(state);
    this.handleForm2Change();
  }

  private getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return (
          <form className="content-wrapper" onSubmit={this.handleNext}>
            <Checkbox
              label="Synchronize from external source"
              checked={this.state.form1.enableSync}
              name="enableSync"
              onCheck={this.handleForm1Change}
              className="checkbox"
            />
            {this.state.form1.enableSync && (
              <TextField
                floatingLabelText="Url to external document"
                errorText={this.state.form1Errors.externalUrl}
                name="externalUrl"
                value={this.state.form1.externalUrl}
                hintText="http://petstore.swagger.io/v2/swagger.json"
                onChange={this.handleForm1Change}
                style={{ width: "100%" }}
                required={true}
              />
            )}
            {this.state.form1Loading && (<LinearProgress mode="indeterminate"/>)}
            <div className="stepper-controls">
              <RaisedButton
                type="submit"
                label="Next"
                primary={true}
                disabled={!this.state.valid1}
              />
            </div>
          </form>
        );
      case 1:
        return (
          <form className="document-wrapper" onSubmit={this.handleNext}>
            {/*<TextField*/}
            {/*multiLine={true}*/}
            {/*value={JSON.stringify(this.state.form2.document)}*/}
            {/*fullWidth={true}*/}
            {/*rowsMax={20}*/}
            {/*/>*/}
            <div className="document-editor">
              <EditorPanel
                document={this.state.form2.document}
                readOnly={this.state.form1.enableSync}
                name="document"
                onChange={this.handleForm2Change}
                onError={this.handleForm2Error}
              />
            </div>
            <div className="stepper-controls">
              {/*<span>{this.state.form2Errors.document}</span>*/}
              <FlatButton
                label="Back"
                onClick={this.handlePrev}
                style={{ marginRight: 12 }}
              />
              <RaisedButton
                type="submit"
                label="Next"
                primary={true}
                disabled={!this.state.valid2}
              />
            </div>
          </form>
        );
      case 2:
        return (
          <form className="content-wrapper" onSubmit={this.handleNext}>
            <div>
              <TextField
                floatingLabelText="Repository Name"
                errorText={this.state.form3Errors.name}
                name="name"
                value={this.state.form3.name}
                onChange={this.handleForm3Change}
                required={true}
              />
            </div>
            {!this.state.form1.enableSync && <div>
              <TextField
                floatingLabelText="Document Tag"
                errorText={this.state.form3Errors.tag}
                name="tag"
                value={this.state.form3.tag}
                onChange={this.handleForm3Change}
                required={true}
              />
            </div>}

            <div className="stepper-controls">
              <FlatButton
                label="Back"
                onClick={this.handlePrev}
                style={{ marginRight: 12 }}
              />
              <RaisedButton
                type="submit"
                label="Create Repository"
                disabled={!this.state.valid3}
                primary={true}
              />
            </div>
          </form>
        );
      default:
        return "You're a long way from home sonny jim!";
    }
  }

}

interface FormData {

  valid1: boolean;
  valid2: boolean;
  valid3: boolean;
  finished: boolean;
  stepIndex: number;
  form1Errors: { [field: string]: string };
  form2Errors: { [field: string]: string };
  form3Errors: { [field: string]: string };
  form1Loading?: any;

  form1: {
    enableSync: boolean;
    externalUrl: string;
    document: any;
  };
  form2: {
    document: any
  };
  form3: {
    name: string;
    tag: string;
  };

}
