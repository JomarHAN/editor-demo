import React, { Component } from "react";
import { EditorState, RichUtils, AtomicBlockUtils } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createHighLightPlugin from "./plugins/highlightPlugin";
import addLinkPlugin from "./plugins/addLinkPlugin";
import BlockStyleToolbar, {
  getBlockStyle,
} from "./blockStyles/BlockStyleToolbar";
import { mediaBlockRenderer } from "./entities/mediaBlockRenderer";

const highlightPlugin = createHighLightPlugin();

export class PageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.plugins = [highlightPlugin, addLinkPlugin];
  }

  focus = () => this.refs.editor.focus();

  onAddImage = (e) => {
    e.preventDefault();
    const editorState = this.state.editorState;
    const urlValue = window.prompt("Paste Image Link");
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
      "create-entity"
    );
    this.setState(
      {
        editorState: AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          " "
        ),
      },
      () => {
        setTimeout(() => this.focus(), 0);
      }
    );
  };

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onAddLink = () => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const link = window.prompt("Paste the link ___");
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return "handled";
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link,
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return "handled";
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    );
  };

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  };

  onItalicClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
    );
  };

  onStrikeThroughClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "STRIKETHROUGH")
    );
  };

  onHighlight = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "HIGHLIGHT")
    );
  };

  render() {
    return (
      <div className="editorContainer">
        <div className="buttonMenu">
          <BlockStyleToolbar
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
          />
          <button
            id="underline"
            className="inline styleButton"
            onClick={this.onUnderlineClick}
          >
            U
          </button>
          <button
            id="bold"
            className="inline styleButton"
            onClick={this.onBoldClick}
          >
            <b>B</b>
          </button>
          <button
            id="italic"
            className="inline styleButton"
            onClick={this.onItalicClick}
          >
            <em>I</em>
          </button>
          <button
            className="strikethrough inline styleButton"
            onClick={this.onStrikeThroughClick}
          >
            abc
          </button>
          <button className="highlight inline styleButton">
            <span
              style={{ backgroundColor: "yellow", padding: "0.3em" }}
              onClick={this.onHighlight}
            >
              H
            </span>
          </button>
          <div className="inline styleButton" onClick={this.onAddImage}>
            <i
              className="material-icons"
              style={{
                fontSize: "16px",
                textAlign: "center",
                padding: "0px",
                margin: "0px",
              }}
            >
              image
            </i>
          </div>
          <button className="add-link" id="link_url" onClick={this.onAddLink}>
            <i className="material-icons">attach_file</i>
          </button>
        </div>
        <div className="editors">
          <Editor
            blockStyleFn={getBlockStyle}
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={this.plugins}
            ref="editor"
            blockRendererFn={mediaBlockRenderer}
          />
        </div>
      </div>
    );
  }
}

export default PageContainer;
