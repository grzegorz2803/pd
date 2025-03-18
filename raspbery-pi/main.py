import pygame
import time
import os
import json
import requests
from datetime import datetime
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
#stałe
PAR_ID = "PRM001"
# inicjalizacja Pygame
pygame.init()

#Ustawienia ekranu
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 480
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.FULLSCREEN)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GRAY = (180, 180, 180)

# Definicja pinów RGB
RED_PIN = 17
GREEN_PIN = 27
BLUE_PIN = 22

# Konfiguracja GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(RED_PIN, GPIO.OUT)
GPIO.setup(GREEN_PIN, GPIO.OUT)
GPIO.setup(BLUE_PIN, GPIO.OUT)

# Ustawienie PWM (częstotliwość 100Hz)
red = GPIO.PWM(RED_PIN, 100)
green = GPIO.PWM(GREEN_PIN, 100)
blue = GPIO.PWM(BLUE_PIN, 100)

# Początkowa wartość 0%
red.start(0)  
green.start(0)
blue.start(0)

#buzzer

BUZZER_PIN = 12
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER_PIN, GPIO.OUT)
buzzer = GPIO.PWM(BUZZER_PIN, 1000)


#Adres serwera API
SERVER_URL = "http://192.168.1.193:3000/api/data"
OFFLINE_FILE = "offline_log.json"

#Czcionki 
font_large = pygame.font.Font(None, 100)  # Duża czcionka na godzinę
font_medium = pygame.font.Font(None, 80)  # Średnia czcionka na datę i dzień tygodnia
font_small = pygame.font.Font(None, 60)   # Mała czcionka na komunikat

# Inicjalizacja czytnika RFID
reader = SimpleMFRC522()
last_rfid_time = 0
rfid_message = None # Wiadomość  z serwera

SYNC_HOURS = ["05:00","14:12"]
last_sync_date = None

# funkcja do skalowania tekstu
def get_scaled_font(lines, max_width, max_height, base_size=80):
    font_size = base_size
    font = pygame.font.Font(None, font_size)
    while any(font.size(line)[0] > max_width for line in lines) or (font.get_height() * len(lines) > max_height):
        font_size -= 2
        if font_size < 20:
            break
        font = pygame.font.Font(None, font_size)
    return font
    
#Sprawdzenie dostępności serwera
def check_server():
    try:
        response = requests.get(SERVER_URL, timeout=1)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False
    
#Zapis do pliku w przypadku braku internetu
def save_offline(data):
    if os.path.exists(OFFLINE_FILE):
        with open(OFFLINE_FILE, "r") as f:
            try:
                offline_data = json.load(f)
            except json.JSONDecodeError:
                offline_data = []
                
    else:
        offline_data = []
    offline_data.append(data)
    
    with open(OFFLINE_FILE, "w") as f:
        json.dump(offline_data, f, indent=1)

#funkcja do wysyłania zapissanych danych na server

def send_offline_data():
    global last_sync_date
    currnet_time = datetime.now().strftime("%H:%M")
    current_date = datetime.now().strftime("%d-%m-%Y")
    
    if currnet_time not in SYNC_HOURS or last_sync_date == current_date:
        return
        
    if os.path.exists(OFFLINE_FILE):
        try:
            with open(OFFLINE_FILE, "r") as f:
                offline_data = json.load(f)
        except json.JSONDecodeError:
            offline_data = []
        
        if offline_data and check_server():
            print(f"Wysyłam {len(offline_data)} zaległych wpisów ...")
            
            new_offline_data = []
            for entry in offline_data:
                try:
                    response = requests.post(SERVER_URL, json=entry, headers={"Content-type": "application/json"})
                    if response.status_code == 200:
                        print(f"Wysłano wpis: {entry}")
                    else:
                        new_offline_data.append(entry)
                except requests.exceptions.RequestException:
                    new_offline_data.append(entry)
                    break
            
            if new_offline_data:
                with open(OFFLINE_FILE, "w") as f:
                    json.dump(new_offline_data, f, indent=1)
            else:
                os.remove(OFFLINE_FILE)
                print("Wszystkie zaległe dane wysłane. Plik usunięty")
            
            last_sync_date = current_date
            
#kolory RGB
def Dred():
    red.ChangeDutyCycle(100)
    green.ChangeDutyCycle(0)
    blue.ChangeDutyCycle(0)

def Dgreen():
    red.ChangeDutyCycle(0)
    green.ChangeDutyCycle(100)
    blue.ChangeDutyCycle(0)    

def Dblue():
    red.ChangeDutyCycle(0)
    green.ChangeDutyCycle(0)
    blue.ChangeDutyCycle(100)

def Dblack():
    red.ChangeDutyCycle(0)
    green.ChangeDutyCycle(0)
    blue.ChangeDutyCycle(0)
    
def beep(frequency, duration):
    buzzer.ChangeFrequency(frequency)
    buzzer.start(60)
    time.sleep(duration)
    buzzer.stop()
    
if check_server():
    Dred()
    time.sleep(1)
    Dblue()
    time.sleep(1)
    Dgreen()
    beep(800,0.5)
    time.sleep(1)
    Dblack()
else:
    Dred()
    beep(300,0.5)
    time.sleep(1)
    Dblack()
    
rfid_id = None
running = True
while running:
    # Obsługa zdarzeń (ESC kończy program)
    for event in pygame.event.get():
        if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            running = False
            
    #wysłanie danych z pliku
    send_offline_data()
    
    # Pobranie aktualnej daty i godziny
    now = datetime.now()
    date_string = now.strftime("%Y-%m-%d")      # Format: 2025-02-06
    weekday_string = now.strftime("%A")         # Nazwa dnia tygodnia (angielska)
    time_string = now.strftime("%H:%M:%S")      # Format: 14:30:15

    # Tłumaczenie nazw dni tygodnia na polski
    dni_tygodnia = {
        "Monday": "Poniedziałek",
        "Tuesday": "Wtorek",
        "Wednesday": "Środa",
        "Thursday": "Czwartek",
        "Friday": "Piątek",
        "Saturday": "Sobota",
        "Sunday": "Niedziela"
    }
    weekday_string = dni_tygodnia.get(weekday_string, weekday_string)
    # Odczyt karty RFID
    try:
        id, text = reader.read_no_block()  # Nie blokuje działania pętli
        if id:
            last_rfid_time = time.time()  # Zapisz czas ostatniego odczytu
            currnet_time = datetime.now().strftime("%Y-%m-%d %H:%M")
            payload = {"card_id":str(id), "timestamp": currnet_time,"id_par": PAR_ID}
            headers = {"Content-Type": "application/json"}
            
            #sprawdzanie połączenia z serverem
            if check_server():
                try:
                    response = requests.post(SERVER_URL, json=payload, headers=headers)
                  #  print(response.status_code)
                    if response.status_code==200:
                        data = response.json()
                        event_name = data.get("name")
                        event_time = data.get("time")
                        event_poinst = data.get("points")
                        
                        rfid_message = f"{event_name}\nGodzina: {event_time}\nPunkty: {event_poinst}"
                        Dgreen()
                        beep(800,0.5)
                        Dblack()
                    elif response.status_code == 501:
                      #  print(response.status_code)
                        data = response.json()
                        event_name = data.get("name")
                        event_message = data.get("message")
                        rfid_message = f"{event_name}\n{event_message}"
                        Dred()
                        beep(300, 0.5)
                        Dblack();
                except Exception as e:
                    rfid_message = "Błąd wysyłania"
                    Dred()
                    beep(300,0.5)
                    Dblack()
            else:
                save_offline(payload)
                rfid_message = "Zapisano do pliku"
                red.ChangeDutyCycle(100)
                green.ChangeDutyCycle(65)
                blue.ChangeDutyCycle(0)
                beep(500,0.5)
                Dblack()
                
    except Exception as e:
        print(f"Błąd RFID: {e}")
   
    # Czyszczenie ekranu
    screen.fill(BLACK)

    # Przełączanie między datą a RFID
    if rfid_message and (time.time() - last_rfid_time < 2):
        lines = rfid_message.split("\n")
        scaled_font = get_scaled_font(lines, SCREEN_WIDTH-40, SCREEN_HEIGHT //2)
        y_offset = SCREEN_HEIGHT // 2 - (len(lines) * scaled_font.get_height()) // 2
        for i, line in enumerate(lines):
        # Wyświetlanie ID karty RFID
            rfid_text = scaled_font.render(line, True, WHITE)
            screen.blit(rfid_text, (SCREEN_WIDTH//2 - rfid_text.get_width()//2, y_offset + i * scaled_font.get_height()+20))
    else:
        rfid_message=None   # Reset po 2 sekundach
        # Renderowanie normalnych tekstów
        date_text = font_medium.render(date_string, True, WHITE)
        weekday_text = font_medium.render(weekday_string, True, WHITE)
        time_text = font_large.render(time_string, True, WHITE)
        info_text = font_small.render("Przyłóż kartę do czytnika", True, GRAY)

        # Pozycje (wyśrodkowanie na ekranie)
        date_pos = (SCREEN_WIDTH//2 - date_text.get_width()//2, 80)
        weekday_pos = (SCREEN_WIDTH//2 - weekday_text.get_width()//2, 160)
        time_pos = (SCREEN_WIDTH//2 - time_text.get_width()//2, 240)
        info_pos = (SCREEN_WIDTH//2 - info_text.get_width()//2, 350)

        # Wyświetlanie tekstów na ekranie
        screen.blit(date_text, date_pos)
        screen.blit(weekday_text, weekday_pos)
        screen.blit(time_text, time_pos)
        screen.blit(info_text, info_pos)
        underline_y = info_pos[1] + info_text.get_height() + 2  # Linia 2px poniżej tekstu
        pygame.draw.line(screen, GRAY, (info_pos[0], underline_y), (info_pos[0] + info_text.get_width(), underline_y), 2)

    # Aktualizacja ekranu
    pygame.display.flip()
    
    # Odświeżanie co sekundę
    time.sleep(0.1)

# Sprzątanie zasobów
GPIO.cleanup()
pygame.quit()
