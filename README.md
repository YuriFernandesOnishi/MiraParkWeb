# MiraPark Web

MiraPark Web é a versão **web** do sistema MiraPark, desenvolvida em **Next.js** com **TypeScript** e **shadcn/ui**.
O projeto é focado no gerenciamento de veículos em garagens e estacionamentos, permitindo visualizar veículos ativos, registrar entradas e saídas e consultar o histórico completo de forma simples e eficiente.

A interface segue a identidade visual do MiraPark, com design moderno, cores escuras e destaque em tons de roxo, mantendo consistência com o aplicativo mobile.

---

## Funcionalidades

* Homepage com logo e botões de **Login** e **Registro**
* Dashboard com:

    * Veículos ativos
    * Contadores de entradas e saídas
    * Gráficos semanais
* Registro de entrada e saída de veículos
* Busca de histórico por **ID** ou **placa**
* Alternância entre tema claro e escuro
* Feedback visual para ações de sucesso e erro

---

## Tecnologias Utilizadas

* **Next.js (App Router)**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide Icons**
* **Sonner** para notificações
* **Axios** para comunicação com API

---

## Como Executar o Projeto

### Pré-requisitos

* Node.js 18 ou superior

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/YuriFernandesOnishi/MiraParkWeb
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o projeto:

   ```bash
   npm run dev
   ```

4. Acesse no navegador:

   ```
   http://localhost:3000
   ```

---

## Integração com API

O frontend consome uma API REST externa responsável pelo controle de veículos, incluindo:

* Listagem de veículos ativos
* Registro de entradas e saídas
* Consulta de histórico por ID ou placa

---

## Conceito Visual

O MiraPark Web utiliza uma identidade visual moderna, com foco em cores escuras e tons de roxo, mantendo consistência com o aplicativo mobile e transmitindo um visual tecnológico, limpo e profissional.
