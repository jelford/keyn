FROM registry.fedoraproject.org/fedora-toolbox:latest

RUN dnf update --all -y
RUN dnf groupinstall -y "Development Tools"
RUN dnf install -y chromium firefox nodejs npm chromedriver
RUN dnf install -y fish zsh direnv
RUN cd $(mktemp -d) && \
    curl -sSL "https://github.com/mozilla/geckodriver/releases/download/v0.29.0/geckodriver-v0.29.0-linux64.tar.gz" -o "geckodriver.tar.gz" && \
    tar -xzf ./geckodriver.tar.gz && \
    chmod +x ./geckodriver && \
    mv geckodriver /usr/bin
