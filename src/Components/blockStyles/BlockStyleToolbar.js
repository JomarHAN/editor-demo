import React, { Component } from 'react'
import HeaderStyleDropdown from './HeaderStyleDropdown'
import BlockStyleButton from './BlockStyleButton'

export const BLOCK_TYPES = [
    { label: `""`, style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: "ordered-list-item" },
    { label: "{ }", style: "code-block" }
]

export const HEADER_TYPES = [
    { label: "h1", style: "header-one" },
    { label: "h2", style: "header-two" },
    { label: "h3", style: "header-three" },
    { label: "h4", style: "header-four" },
    { label: "h5", style: "header-five" },
    { label: "h6", style: "header-six" }
]

export function getBlockStyle(block) {
    switch (block.getType()) {
        case "blockquote":
            return "RichEditor-blockquote"
        default:
            return null;
    }
}

class BlockStyleToolbar extends Component {
    render() {
        const { editorState } = this.props;
        const selection = editorState.getSelection()
        const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();
        return (

            <span className="RichEditor-controls">
                <HeaderStyleDropdown
                    headerOptions={HEADER_TYPES}
                    active={blockType}
                    onToggle={this.props.onToggle}
                />
                {BLOCK_TYPES.map(type => {
                    return (
                        <BlockStyleButton
                            active={type.style === blockType}
                            label={type.label}
                            onToggle={this.props.onToggle}
                            style={type.style}
                            key={type.label}
                            type={type}
                        />
                    )
                })}
            </span>
        )
    }
}

export default BlockStyleToolbar

