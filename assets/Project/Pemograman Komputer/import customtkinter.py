import customtkinter as ctk
import tkinter.messagebox as tkmb

# Selecting GUI theme - dark, light , system (for system default)
ctk.set_appearance_mode("system")
# Selecting color theme - blue, green, dark-blue
ctk.set_default_color_theme("blue")

screen1 = ctk.CTk()
screen1.geometry("400x400")
screen1.title("Power Factor Correction")

def fase():
    screen3 = ctk.CTkToplevel(screen1)
    screen3.title("uhuy")
    screen3.geometry("300x200")
    screen2.withdraw()
    ctk.CTkLabel(screen3, text="halo gimana").pack()

def start_program():
    global screen2
    screen2 = ctk.CTkToplevel(screen1)
    screen2.title("uhuy")
    screen2.geometry("400x200")
    screen1.withdraw()
    ctk.CTkLabel(screen2, text="halo semua").pack()
    
    button2 = ctk.CTkButton(screen2, text='yu', command=fase)
    button2.pack(pady=12, padx=10)

label = ctk.CTkLabel(screen1, text="Welcome\nPower Factor Correction")
label.pack(pady=20)

button = ctk.CTkButton(screen1, text='Start', command=start_program)
button.pack(pady=12, padx=10)

label = ctk.CTkLabel(screen1, text="Produced by :\nArief Indra Kusuma\nEstu Bhekti Cahyono\nMuhandis Lad'Zai")
label.pack()

screen1.mainloop()