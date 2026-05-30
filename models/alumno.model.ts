import { PersonaModel } from "./persona.model";

export class AlumnoModel extends PersonaModel {
    private legajo: number;
    private fechaAlta: string;
    private modificacion: string;
    private isActive: boolean;


    constructor(
        legajo: number, 
        nombre: string, 
        apellido: string, 
        email: string,
        fechaAlta?: string,
        modificacion?: string,
        isActive?: boolean
    ) {
        
        super(nombre, apellido, email);

        if (!this.validarLegajo(legajo)) {
            throw new Error("El legajo debe ser un número mayor o igual a 10000.");
        }
        
        if (!this.validarString(nombre)) {
            throw new Error("El nombre no puede estar vacío y debe contener solo letras.");
        }
        
        if (!this.validarString(apellido)) {
            throw new Error("El apellido no puede estar vacío y debe contener solo letras.");
        }
        
        if (!this.validateEmail(email)) {
            throw new Error("El email debe terminar con '@facultad.edu.ar'.");
        }

        this.legajo = legajo;

        const hoy = new Date().toISOString().split('T')[0];
        
        this.fechaAlta = fechaAlta ?? hoy;
        this.modificacion = modificacion ?? hoy;
        this.isActive = isActive ?? true;
    }

    private validarLegajo(legajo: number): boolean {
        if (legajo < 10000){
            return false;
        }
        return true;
    }

    private validarString(value: string): boolean {
        if (!value || value.trim() === "") {
            return false;
        }
        const regexLetras = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;
        if (!regexLetras.test(value.trim())) {
            return false;
        }
        return true;
    }

    private validateEmail(email: string): boolean {
        if (!email.endsWith("@facultad.edu.ar")){  
            return false;
        }
        return true;
    }


    public setNombre(nombre: string): void {
        if (!this.validarString(nombre)) {
            throw new Error("El nombre no puede estar vacío y debe contener solo letras.");
        }
        this.nombre = nombre.trim();
        this.modificacion = new Date().toISOString().split('T')[0];
    }

    public setApellido(apellido: string): void {
        if (!this.validarString(apellido)) {
            throw new Error("El apellido no puede estar vacío y debe contener solo letras.");
        }
        this.apellido = apellido.trim();
        this.modificacion = new Date().toISOString().split('T')[0];
    }

    public setEmail(email: string): void {
        if (!this.validateEmail(email)) {
            throw new Error("El email debe terminar con '@facultad.edu.ar'.");
        }
        this.email = email.trim();
        this.modificacion = new Date().toISOString().split('T')[0];
    }

    public setIsActive(isActive: boolean): void {
        this.isActive = isActive;
        this.modificacion = new Date().toISOString().split('T')[0];
    }


    public getLegajo(): number {
        return this.legajo;
    }
    
    public getFechaAlta(): string {
        return this.fechaAlta;
    }

    public getModificacion(): string {
        return this.modificacion;
    }

    public getIsActive(): boolean {
        return this.isActive;
    }

    public getAllAttributes(): object {
        return {
            legajo: this.legajo,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            fechaAlta: this.fechaAlta,
            modificacion: this.modificacion,
            isActive: this.isActive
        }
    }
}