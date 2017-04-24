
export interface Props {
    className?: string,
    children?: any[]
}

export interface State {

}

export interface Data {
    props: Props,
    state: State
}

export interface View {
    make(self: any): JSX.Element;
}