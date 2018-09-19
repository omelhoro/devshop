import * as React from 'react';

/* tslint:disable */
export default () => (
	<div id=""><h2 id="first-h2"><a id="Objetivo_0" />Objetivo</h2>
		<p>Criar o carrinho de compras de uma loja que vende desenvolvedores baseado no exemplo fornecido.</p>
		<p><img
			style={{
				margin: '0px auto',
				display: 'block',
				border: '2px solid black',
				boxShadow: '10px 5px 5px red',
			}}
			src="http://i.imgur.com/8NPz67T.png"

			alt="Imgur"
		/>
		</p>
		<p>Queremos descobrir seu nível de habilidade em todas as áreas envolvidas na construção de um aplicativo web: <em>back end</em>, <em>front end</em> e usabilidade.</p>
		<p>Sinta-se confortável para focar nas áreas que você tem mais habilidade.</p>
		<h2><a id="Tarefas_e_priorizao_10" />Tarefas e priorização</h2>
		<p>Priorize a lista de tarefas abaixo explicando os motivos da priorização de cada uma delas. Então, escolha de três a seis tarefas para implementar.</p>
		<ul>
			<li>Determinar o preço do desenvolvedor a partir de informações do seu perfil do GitHub, como por exemplo: followers, repos, stars, commits, etc.</li>
			<li>Substituir os inputs de texto por uma lista de desenvolvedores com nome, foto, preço e um botão de “Adicionar ao carrinho”.</li>
			<li>Popular a lista de desenvolvedores a partir de uma organização do GitHub.</li>
			<li>Permitir a escolha de quantidade de horas contratadas de cada desenvolvedor.</li>
			<li>Permitir a adição de um cupom de desconto que altera o preço total da compra. Utilize o código “SHIPIT”.</li>
			<li>Adicionar um botão de “comprar” que leva o usuário a uma página de pedido confirmado.</li>
			<li>Melhorar a visualização do desenvolvedor no carrinho mostrando mais informações.</li>
			<li>Criar paginação para a lista de desenvolvedores.</li>
		</ul>
		<h2><a id="Server_side_23" />Server side</h2>
		<p>Crie uma API REST simples que, no mínimo, utiliza uma lista em memória para guardar o estado do carrinho.</p>
		<p>As tarefas mais avançadas exigem integração com API do GitHub. Além disso, você pode utilizar uma persistência mais robusta.</p>
		<p>Testes automatizados são <strong>extremamente</strong> bem vindos.</p>
		<p>Adoraríamos que você utilizasse <a href="https://golang.org/">Go</a>, <a href="http://www.asp.net/">.NET</a> ou <a href="https://nodejs.org/">Node</a> para construir sua API. Caso contrário, justifique sua escolha de tecnologia.</p>
		<h2><a id="Client_side_33" />Client side</h2>
		<p>Você pode implementar toda a interface com HTML renderizado server-side e formulários.</p>
		<p>Uma opção melhor é criar uma <em>single page application</em> que utilize a API REST por AJAX.</p>
		<p>De preferência, utilize <a href="https://facebook.github.io/react/">React</a>. Caso deseje utilizar outras tecnologias, justifique sua escolha.</p>
		<h2><a id="Entrega_e_observaes_41" />Entrega e observações</h2>
		<p>Seu código deve estar disponível em um repositório <em>git</em>, preferencialmente hospedado no <a href="https://github.com/">Github</a>.</p>
		<p>Você pode utilizar plataformas como <a href="https://www.heroku.com/">Heroku</a> ou <a href="https://cloud.google.com/">Google Cloud Plataform</a> para nos mostrar a aplicação funcionando em produção.</p>
		<p>Não se preocupe se você não tem experiência em Go, Node ou React. Grande parte do nosso trabalho é lidar com novas tecnologias. Vamos levar isso em consideração.</p>
		<p>Boa sorte!</p>
	</div>
);
