export interface Component {
    //initialisation the composant (listenners, animation)
    init(): void;
    //destruction of creation (listenners, animation)
    destroy(): void;
}