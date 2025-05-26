---

# voXel

**voXel** is a Docker-based application requiring Docker Desktop with WSL2 support on Windows.

---

## Requirements

- Docker Desktop (with WSL2 integration enabled)
    
- WSL2 Terminal on Windows
    

---

## Configuration

Create a `.env` file in the project directory with the following environment variables:

```env
WO_HOST=localhost
WO_PORT=8000
WO_MEDIA_DIR=appmedia
WO_DB_DIR=dbdata
WO_SSL=NO
WO_SSL_KEY=
WO_SSL_CERT=
WO_SSL_INSECURE_PORT_REDIRECT=80
WO_DEBUG=NO
WO_DEV=NO
WO_BROKER=redis://broker
WO_DEFAULT_NODES=1
WO_SETTINGS=
```

---

## Installation & Running

```bash
# Clone the repository
git clone https://github.com/neelkalpa/voXel 

# Change to the project directory
cd voXel

# Make the startup script executable
chmod +x voXel.sh

# Start voXel in development mode
./voXel.sh start --dev
```

---

## Notes

- Ensure Docker Desktop is running with WSL2 backend.
- The application will run on the host and port specified by `WO_HOST` and `WO_PORT`.
- Media and database directories will be mapped according to the `.env` file.
    

---
