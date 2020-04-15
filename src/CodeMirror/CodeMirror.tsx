import React, {useState, useRef, useEffect, useCallback} from 'react';
import CodeMirror from 'codemirror';
import cx from 'classnames';
import _isEqual from 'lodash/isEqual';
import _noop from 'lodash/noop';
import _forEach from 'lodash/forEach';
import _partial from 'lodash/partial';
import {WithDefaultProps} from '../sprTypes';

const normalizeLineEndings = (str: string): string => {
	if (!str) return str;
	return str.replace(/\r\n|\r/g, '\n');
}

interface CodeMirrorPropTypes {
	autoFocus?: boolean;
	className?: any;
	codeMirrorInstance?: typeof CodeMirror,
	defaultValue?: string;
	name?: string;
	onChange: (newVal: string, change?: CodeMirror.EditorChange) => void,
	onCursorActivity?: (codeMirrorInstance: CodeMirror.Editor) => void;
	onFocusChange?: (isFocused: boolean) => void;
	onScroll?: (scrollInfo: CodeMirror.ScrollInfo) => void;
	options: {
		[x in keyof CodeMirror.EditorConfiguration]: any;
	};
	value: string;
	preserveScrollPosition?: boolean;
};

const defaultProps = {
	preserveScrollPosition: false,
	value: '',
	options: {},
	onChange: _noop,
};

const CodeMirrorContainer = (props: WithDefaultProps<CodeMirrorPropTypes, typeof defaultProps>) => {
	const {
		className,
		name,
		value,
		autoFocus,
		options,
		defaultValue,
		preserveScrollPosition,
		codeMirrorInstance: CodeMirrorPropInstance,
		onChange,
		onCursorActivity,
		onScroll,
		onFocusChange,
	} = props;
	const [isFocused, changeFocusState] = useState<boolean>(false);
	const textAreadNode = useRef<HTMLTextAreaElement>(null);
	const codeMirrorInstance = useRef(CodeMirrorPropInstance || CodeMirror);
	const codeMirror = useRef<CodeMirror.EditorFromTextArea>(null);

	const setOptionIfChanged = (optionName: keyof CodeMirror.EditorConfiguration, newValue: string) => {
		const oldValue = codeMirror.current && codeMirror.current.getOption(optionName);
		if (!_isEqual(oldValue, newValue)) {
			codeMirror.current && codeMirror.current.setOption(optionName, newValue);
		}
	};

	const codemirrorValueChanged = useCallback((doc: CodeMirror.Doc, change: CodeMirror.EditorChange) => {
		if (onChange && change.origin !== 'setValue') {
			onChange(doc.getValue(), change);
		}
	}, [onChange]);

	const cursorActivity = useCallback((cm: CodeMirror.Editor) => {
		onCursorActivity && onCursorActivity(cm);
	}, [onCursorActivity]);

	const focusChanged = useCallback((isFocused: boolean) => {
		changeFocusState(isFocused);
		onFocusChange && onFocusChange(isFocused);
	}, [onFocusChange]);

	const scrollChanged = useCallback((cm: CodeMirror.Editor) => {
		onScroll && onScroll(cm.getScrollInfo());
	}, [onScroll]);

	useEffect(() => {
		if (!!textAreadNode.current) {
			//@ts-ignore
			codeMirror.current = codeMirrorInstance.current.fromTextArea(textAreadNode.current, options);
	 		codeMirror.current.on('change', codemirrorValueChanged);
			codeMirror.current.on('cursorActivity', cursorActivity);
			codeMirror.current.on('focus', _partial(focusChanged, true));
			codeMirror.current.on('blur', _partial(focusChanged, false));
			codeMirror.current.on('scroll', scrollChanged);
			codeMirror.current.setValue(defaultValue || '');
		}
		return () => {
			codeMirror.current && codeMirror.current.toTextArea();
		}
	}, [codemirrorValueChanged, cursorActivity, focusChanged, scrollChanged, defaultValue, options]);


	useEffect(() => {
		_forEach(options, (optionValue, optionName) => {
			setOptionIfChanged(optionName as keyof CodeMirror.EditorConfiguration, optionValue);
		});
	}, [options]);

	useEffect(() => {
		if(codeMirror.current && value!==undefined && normalizeLineEndings(codeMirror.current.getValue()) !== normalizeLineEndings(value)) {
			if(preserveScrollPosition) {
				const preserveScrollPosition = codeMirror.current.getScrollInfo();
				codeMirror.current.setValue(value);
				codeMirror.current.scrollTo(preserveScrollPosition.left, preserveScrollPosition.top);
			} else {
				codeMirror.current.setValue(value);
			}
		}
	}, [value, preserveScrollPosition]);

	return (
		<div className={cx('ReactCodeMirror', className, {'ReactCodeMirror--focused': isFocused })}>
			<textarea
					ref={textAreadNode}
					name={name}
					defaultValue={value}
					autoComplete="off"
					autoFocus={autoFocus}
			/>
		</div>
	);
};

CodeMirrorContainer.defaultProps = defaultProps;

export default CodeMirrorContainer;