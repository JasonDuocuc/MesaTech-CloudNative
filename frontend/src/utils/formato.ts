export function legible(texto: string): string {
    const t = texto.replace(/_/g, " ").toLowerCase();
    return t.charAt(0).toUpperCase() + t.slice(1);
}

export function fechaCorta(iso: string): string {
    return new Date(iso).toLocaleDateString("es-CL");
}